/**
 * Phase 3.1c runtime format module generator.
 * Generates runtime Format.Set registrations from the shared mapping registry
 * so emitted schema format names and runtime validators cannot drift.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FORMAT_RULES } from './format-mapping-registry.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_FILE = path.resolve(__dirname, '../../src/lib/formaters.ts')

function toFileContent() {
  const header = [
    '// Generated from staging/phase3/format-mapping-registry.mjs - do not edit manually',
    "import Format from 'typebox/format'",
    '',
    'let _registered = false',
    '',
    'export function registerRuntimeFormats(): void {',
    '  if (_registered) return'
  ]

  const lines = FORMAT_RULES.map(rule => {
    const escapedRegex = JSON.stringify(rule.runtimeRegex)
    return `  Format.Set(${JSON.stringify(rule.format)}, (value) => typeof value === 'string' && new RegExp(${escapedRegex}).test(value))`
  })

  const footer = [
    '  _registered = true',
    '}',
    ''
  ]

  return [...header, ...lines, ...footer].join('\n')
}

function main() {
  fs.writeFileSync(OUT_FILE, toFileContent(), 'utf8')
  console.log(`Wrote ${OUT_FILE}`)
  console.log(`Runtime formats: ${FORMAT_RULES.length}`)
}

main()
