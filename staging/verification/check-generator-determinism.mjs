import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { GROUPS } from '../converter/config/groups.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../..')
const phase3Dir = path.join(repoRoot, 'staging/schemas/generated')
const runtimeFormatsFile = path.join(repoRoot, 'src/lib/formats.ts')

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function buildGeneratedFileList() {
  const files = []
  for (const group of GROUPS) {
    const batchDir = path.join(phase3Dir, group.name)
    const manifestPath = path.join(batchDir, 'manifest.json')
    files.push(manifestPath)

    const manifest = await readJson(manifestPath)
    if (Array.isArray(manifest.outputs) && manifest.outputs.length > 0) {
      for (const output of manifest.outputs) {
        files.push(path.join(batchDir, output.outputFile))
      }
    } else if (group.name === 'foundation') {
      files.push(path.join(batchDir, 'foundation-definitions.ts'))
    }
  }
  files.push(runtimeFormatsFile)
  return files
}

function runGenerator(filePath) {
  execFileSync(process.execPath, [filePath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      SCHEMA_OUTPUT_ROOT: phase3Dir,
    },
    stdio: 'inherit'
  })
}

function runFullGeneration(generatorFiles) {
  for (const generatorFile of generatorFiles) {
    runGenerator(generatorFile)
  }
  runGenerator(path.join(repoRoot, 'staging/schemas/generate-runtime-format-module.mjs'))
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
  const resolvedGeneratorFiles = GROUPS.map((group) => group.generator)
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