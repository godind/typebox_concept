import { execFileSync } from 'node:child_process'
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { baselineRoot, repoRoot, runtimeFormatsOutputFile, schemaArtifactsRoot } from './runtime.mjs'

const SNAPSHOT_SCHEMA_DIR = path.join(baselineRoot, 'schema')
const SNAPSHOT_RUNTIME_FORMATS_FILE = path.join(baselineRoot, 'formats.ts')
const CURRENT_RUNTIME_FORMATS_FILE = runtimeFormatsOutputFile

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

async function collectFiles(dirPath, baseDir = dirPath) {
  const output = []
  for (const entry of await readdir(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      output.push(...await collectFiles(fullPath, baseDir))
      continue
    }
    output.push(path.relative(baseDir, fullPath))
  }
  return output.sort()
}

function gitDiff(fromPath, toPath) {
  try {
    execFileSync('git', ['--no-pager', 'diff', '--no-index', '--', fromPath, toPath], {
      cwd: repoRoot,
      stdio: 'inherit'
    })
  } catch (error) {
    // git diff exits 1 when differences are found, which is expected here.
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) return
    throw error
  }
}

export async function captureBaselineSnapshot() {
  await mkdir(schemaArtifactsRoot, { recursive: true })
  await mkdir(path.dirname(CURRENT_RUNTIME_FORMATS_FILE), { recursive: true })
  await rm(baselineRoot, { recursive: true, force: true })
  await mkdir(baselineRoot, { recursive: true })

  await cp(schemaArtifactsRoot, SNAPSHOT_SCHEMA_DIR, { recursive: true })
  await cp(CURRENT_RUNTIME_FORMATS_FILE, SNAPSHOT_RUNTIME_FORMATS_FILE)
}

export async function diffAgainstBaseline() {
  await mkdir(schemaArtifactsRoot, { recursive: true })
  const baselineExists = await pathExists(SNAPSHOT_SCHEMA_DIR)
  if (!baselineExists) {
    throw new Error('No baseline snapshot found. Run schemas:snapshot first.')
  }

  const baselineFiles = await collectFiles(SNAPSHOT_SCHEMA_DIR)
  const currentFiles = await collectFiles(schemaArtifactsRoot)
  const baselineSet = new Set(baselineFiles)
  const currentSet = new Set(currentFiles)

  const added = currentFiles.filter((file) => !baselineSet.has(file))
  const removed = baselineFiles.filter((file) => !currentSet.has(file))
  const common = currentFiles.filter((file) => baselineSet.has(file))

  const changed = []
  for (const file of common) {
    const baselinePath = path.join(SNAPSHOT_SCHEMA_DIR, file)
    const currentPath = path.join(schemaArtifactsRoot, file)
    try {
      execFileSync('cmp', ['-s', baselinePath, currentPath], { cwd: repoRoot, stdio: 'ignore' })
    } catch {
      changed.push(file)
    }
  }

  const runtimeFormatsChanged = (() => {
    try {
      execFileSync('cmp', ['-s', SNAPSHOT_RUNTIME_FORMATS_FILE, CURRENT_RUNTIME_FORMATS_FILE], {
        cwd: repoRoot,
        stdio: 'ignore'
      })
      return false
    } catch {
      return true
    }
  })()

  const hasDiff = added.length > 0 || removed.length > 0 || changed.length > 0 || runtimeFormatsChanged

  console.log('Schema artifact diff summary:')
  console.log(`- added: ${added.length}`)
  console.log(`- removed: ${removed.length}`)
  console.log(`- changed: ${changed.length}`)
  console.log(`- runtime formats changed: ${runtimeFormatsChanged ? 'yes' : 'no'}`)

  for (const file of added) console.log(`+ ${file}`)
  for (const file of removed) console.log(`- ${file}`)

  for (const file of changed) {
    const baselinePath = path.join(SNAPSHOT_SCHEMA_DIR, file)
    const currentPath = path.join(schemaArtifactsRoot, file)
    gitDiff(baselinePath, currentPath)
  }

  if (runtimeFormatsChanged) {
    gitDiff(SNAPSHOT_RUNTIME_FORMATS_FILE, CURRENT_RUNTIME_FORMATS_FILE)
  }

  return hasDiff
}
