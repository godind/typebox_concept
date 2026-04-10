import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { repoRoot } from '../core/runtime.mjs'
import { generateIntellisenseHelpers } from '../publish/generate-intellisense-helpers.mjs'

const LIB_SCHEMAS_ROOT = path.join(repoRoot, 'src/lib/schemas')
const LIB_INTELLISENSE_ROOT_REL = 'src/lib/intellisense'
const INTELLISENSE_OUTPUT_DIR = path.join(repoRoot, 'converter/intellisenseOutput')
const INTELLISENSE_DIAGNOSTIC_DIR = path.join(repoRoot, 'converter/intellisenseDiagnostic')
const TYPEHELPERS_REPORT_FILE = path.join(INTELLISENSE_DIAGNOSTIC_DIR, 'typehelpers-report.json')

const FACADE_SPEC = {
  transport: ['Hello', 'Discovery', 'Delta', 'Source', 'SourceRef', 'Timestamp'],
  values: ['NumberValue', 'StringValue', 'DatetimeValue', 'NullValue', 'ValuesNumberValue', 'ValuesStringValue', 'ValuesDatetimeValue'],
  meta: ['Meta', 'AlarmState', 'AlarmMethodEnum', 'Units'],
  spatial: ['Position', 'Waypoint', 'Geohash'],
  identity: ['Mmsi', 'AircraftMmsi', 'AtonMmsi', 'SarMmsi', 'Uuid', 'Url', 'Version'],
  protocol: ['Hello', 'Discovery', 'Delta']
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function indexLibrarySymbols() {
  const bySymbol = new Map()

  async function walk(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }
      if (!entry.name.endsWith('.ts')) continue
      if (entry.name === 'manifest.json') continue

      const relFromRepo = path.relative(repoRoot, fullPath)
      const source = await readFile(fullPath, 'utf8')
      const typeMatches = [...source.matchAll(/export\s+type\s+([A-Za-z0-9_]+)\s*=/g)]
      for (const match of typeMatches) {
        const symbol = match[1]
        bySymbol.set(symbol, relFromRepo)
      }
    }
  }

  await walk(LIB_SCHEMAS_ROOT)
  return bySymbol
}

function collectMissingSymbols(symbolIndex) {
  const missing = []
  for (const [group, symbols] of Object.entries(FACADE_SPEC)) {
    for (const symbol of symbols) {
      if (!symbolIndex.has(symbol)) {
        missing.push(`${group}: missing symbol ${symbol}`)
      }
    }
  }
  return missing
}

async function main() {
  if (!(await pathExists(LIB_SCHEMAS_ROOT))) {
    throw new Error(`Missing library schemas: ${path.relative(repoRoot, LIB_SCHEMAS_ROOT)}. Run schema:publish (or promote schemas) first.`)
  }

  console.log('Indexing library schema symbols for type helpers...')
  const symbolIndex = await indexLibrarySymbols()

  const missing = collectMissingSymbols(symbolIndex)
  if (missing.length > 0) {
    throw new Error(`schemas:typehelpers blocked due to missing symbols:\n- ${missing.join('\n- ')}`)
  }

  console.log('Generating type helpers into converter/intellisenseOutput...')
  const report = await generateIntellisenseHelpers({
    repoRoot,
    symbolIndex,
    outputDir: INTELLISENSE_OUTPUT_DIR,
    diagnosticsDir: INTELLISENSE_DIAGNOSTIC_DIR,
    libIntellisenseRoot: LIB_INTELLISENSE_ROOT_REL,
    facadeSpec: FACADE_SPEC
  })

  await mkdir(INTELLISENSE_DIAGNOSTIC_DIR, { recursive: true })
  await writeFile(TYPEHELPERS_REPORT_FILE, JSON.stringify(report, null, 2), 'utf8')

  console.log('schemas:typehelpers complete.')
  console.log(`Output dir: ${path.relative(repoRoot, INTELLISENSE_OUTPUT_DIR)}`)
  console.log(`Diagnostic dir: ${path.relative(repoRoot, INTELLISENSE_DIAGNOSTIC_DIR)}`)
  console.log(`Report: ${path.relative(repoRoot, TYPEHELPERS_REPORT_FILE)}`)
}

await main()
