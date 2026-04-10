import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../..')
const phase3Dir = path.join(repoRoot, 'staging/schemas')
const runtimeFormatsFile = path.join(repoRoot, 'src/lib/formats.ts')

function compareBatchDirs(left, right) {
  return Number.parseInt(left.match(/^batch(\d+)/)?.[1] ?? '0', 10)
    - Number.parseInt(right.match(/^batch(\d+)/)?.[1] ?? '0', 10)
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

function assert(condition, message, failures) {
  if (!condition) {
    failures.push(message)
  }
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

async function verifyBatch(batchDirName, duplicateOutputs, failures, warningSummary) {
  const batchDir = path.join(phase3Dir, batchDirName)
  const manifestPath = path.join(batchDir, 'manifest.json')
  const generatorFiles = (await readdir(batchDir)).filter((name) => /^generate-.*\.mjs$/.test(name))

  assert(await pathExists(manifestPath), `Missing manifest: ${path.relative(repoRoot, manifestPath)}`, failures)
  assert(generatorFiles.length === 1, `Expected 1 generator in ${path.relative(repoRoot, batchDir)}, found ${generatorFiles.length}`, failures)

  if (!(await pathExists(manifestPath))) {
    return
  }

  const manifest = await readJson(manifestPath)
  const exceptions = Array.isArray(manifest.exceptions) ? manifest.exceptions : []
  const warnings = Array.isArray(manifest.warnings) ? manifest.warnings : []

  assert(manifest.phase === 'Phase 3', `Unexpected phase in ${path.relative(repoRoot, manifestPath)}: ${manifest.phase}`, failures)
  assert(typeof manifest.batch === 'string' && manifest.batch.length > 0, `Missing batch label in ${path.relative(repoRoot, manifestPath)}`, failures)
  assert(exceptions.length === 0, `${path.relative(repoRoot, manifestPath)} has ${exceptions.length} exception(s)`, failures)

  if (warnings.length > 0) {
    warningSummary.push(`${manifest.batch}: ${warnings.length} warning(s)`)
  }

  const outputs = Array.isArray(manifest.outputs) ? manifest.outputs : []
  if (outputs.length === 0 && batchDirName === 'batch0-foundation') {
    const foundationFile = path.join(batchDir, 'foundation-definitions.ts')
    assert(await pathExists(foundationFile), `Missing generated foundation file: ${path.relative(repoRoot, foundationFile)}`, failures)
    duplicateOutputs.add(path.relative(repoRoot, foundationFile))
    return
  }

  for (const output of outputs) {
    const outputFile = path.join(batchDir, output.outputFile)
    const relativeOutputFile = path.relative(repoRoot, outputFile)
    const filePresent = await pathExists(outputFile)
    assert(filePresent, `Missing generated output: ${relativeOutputFile}`, failures)
    if (!filePresent) {
      continue
    }

    assert(!duplicateOutputs.has(relativeOutputFile), `Duplicate generated output path declared: ${relativeOutputFile}`, failures)
    duplicateOutputs.add(relativeOutputFile)

    const outputSource = await readFile(outputFile, 'utf8')
    assert(outputSource.includes(`export const ${output.schemaName}`), `Missing schema export ${output.schemaName} in ${relativeOutputFile}`, failures)
    assert(outputSource.includes(`export type ${output.typeName}`), `Missing type export ${output.typeName} in ${relativeOutputFile}`, failures)
  }
}

async function main() {
  const failures = []
  const warningSummary = []
  const duplicateOutputs = new Set()
  const batchDirs = await getBatchDirs()

  assert(batchDirs.length === 12, `Expected 12 Phase 3 batch directories, found ${batchDirs.length}`, failures)

  for (const batchDir of batchDirs) {
    await verifyBatch(batchDir, duplicateOutputs, failures, warningSummary)
  }

  const runtimeFormatsPresent = await pathExists(runtimeFormatsFile)
  assert(runtimeFormatsPresent, `Missing runtime format module: ${path.relative(repoRoot, runtimeFormatsFile)}`, failures)
  if (runtimeFormatsPresent) {
    const runtimeFormatSource = await readFile(runtimeFormatsFile, 'utf8')
    assert(runtimeFormatSource.includes('export function registerRuntimeFormats'), 'Runtime format module does not export registerRuntimeFormats', failures)
  }

  if (failures.length > 0) {
    console.error('Phase 4 integrity check failed:')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exit(1)
  }

  console.log(`Phase 4 integrity check passed for ${batchDirs.length} batch directories.`)
  if (warningSummary.length > 0) {
    console.log('Manifest warnings remain visible:')
    for (const line of warningSummary) {
      console.log(`- ${line}`)
    }
  } else {
    console.log('No manifest warnings reported.')
  }
}

await main()