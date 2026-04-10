import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../..')
const phase3Dir = path.join(repoRoot, 'staging/phase3')
const runtimeFormatsFile = path.join(repoRoot, 'src/lib/formats.ts')

function compareBatchDirs(left, right) {
  return Number.parseInt(left.match(/^batch(\d+)/)?.[1] ?? '0', 10)
    - Number.parseInt(right.match(/^batch(\d+)/)?.[1] ?? '0', 10)
}

async function getBatchDirs() {
  const entries = await readdir(phase3Dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory() && /^batch\d+/.test(entry.name))
    .map((entry) => entry.name)
    .sort(compareBatchDirs)
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function buildGeneratedFileList() {
  const files = []
  for (const batchDirName of await getBatchDirs()) {
    const batchDir = path.join(phase3Dir, batchDirName)
    const manifestPath = path.join(batchDir, 'manifest.json')
    files.push(manifestPath)

    const manifest = await readJson(manifestPath)
    if (Array.isArray(manifest.outputs) && manifest.outputs.length > 0) {
      for (const output of manifest.outputs) {
        files.push(path.join(batchDir, output.outputFile))
      }
    } else if (batchDirName === 'batch0-foundation') {
      files.push(path.join(batchDir, 'foundation-definitions.ts'))
    }
  }
  files.push(runtimeFormatsFile)
  return files
}

function runGenerator(filePath) {
  execFileSync(process.execPath, [filePath], {
    cwd: repoRoot,
    stdio: 'inherit'
  })
}

function runFullGeneration(generatorFiles) {
  for (const generatorFile of generatorFiles) {
    runGenerator(generatorFile)
  }
  runGenerator(path.join(repoRoot, 'staging/phase3/generate-runtime-format-module.mjs'))
}

async function hashFiles(filePaths) {
  const hash = createHash('sha256')
  for (const filePath of filePaths) {
    hash.update(path.relative(repoRoot, filePath))
    hash.update('\0')
    hash.update(await readFile(filePath))
    hash.update('\0')
  }
  return hash.digest('hex')
}

async function main() {
  const batchDirs = await getBatchDirs()
  const generatorFiles = batchDirs.map((batchDirName) => {
    const batchDir = path.join(phase3Dir, batchDirName)
    return readdir(batchDir).then((entries) => {
      const generatorFile = entries.find((name) => /^generate-.*\.mjs$/.test(name))
      if (!generatorFile) {
        throw new Error(`Missing generator in ${path.relative(repoRoot, batchDir)}`)
      }
      return path.join(batchDir, generatorFile)
    })
  })

  const resolvedGeneratorFiles = await Promise.all(generatorFiles)
  runFullGeneration(resolvedGeneratorFiles)
  const generatedFiles = await buildGeneratedFileList()
  const pass1Hash = await hashFiles(generatedFiles)

  runFullGeneration(resolvedGeneratorFiles)
  const pass2Hash = await hashFiles(generatedFiles)

  console.log(`PASS1_HASH=${pass1Hash}`)
  console.log(`PASS2_HASH=${pass2Hash}`)

  if (pass1Hash !== pass2Hash) {
    console.error('DETERMINISTIC=NO')
    process.exit(1)
  }

  console.log('DETERMINISTIC=YES')
}

await main()