import { GROUPS, RUNTIME_FORMAT_GENERATOR } from '../config/groups.mjs'
import { parseRequestedGroups, resolveGroups, runNodeScript } from '../core/runtime.mjs'
import { writeSchemaDiagnostics } from '../core/schema-diagnostics.mjs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { FORMAT_RULES } from '../processors/format-mapping-registry.mjs'
import { repoRoot, schemaArtifactsRoot } from '../core/runtime.mjs'

const ANSI = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
}

function color(text, tone) {
  return `${ANSI[tone]}${text}${ANSI.reset}`
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function collectBuildSummary(selected) {
  let totalSchemas = 0
  let totalDefinitions = 0
  let totalWarnings = 0
  let totalErrors = 0
  const warningItems = []

  for (const group of selected) {
    const manifestPath = path.join(schemaArtifactsRoot, group.name, 'manifest.json')
    const manifest = await readJson(manifestPath)
    totalSchemas += Array.isArray(manifest.outputs) ? manifest.outputs.length : 0
    if (typeof manifest.definitionCount === 'number') {
      totalSchemas += 1
      totalDefinitions += manifest.definitionCount
    }
    const manifestWarnings = Array.isArray(manifest.warnings) ? manifest.warnings : []
    totalWarnings += manifestWarnings.length
    totalErrors += Array.isArray(manifest.exceptions) ? manifest.exceptions.length : 0
    for (const warning of manifestWarnings) {
      warningItems.push({
        scope: group.name,
        location: warning.location,
        detail: warning.detail
      })
    }
  }

  return {
    totalSchemaGroups: selected.length,
    totalSchemas,
    totalDefinitions,
    totalFormats: FORMAT_RULES.length,
    totalWarnings,
    totalErrors,
    warningItems
  }
}

const requested = parseRequestedGroups(process.argv.slice(2))
const selected = resolveGroups(requested)

console.log(`Building schema groups: ${selected.map((group) => group.name).join(', ')}`)

for (const group of selected) {
  runNodeScript(group.generator)
}

if (selected.length > 0) {
  runNodeScript(RUNTIME_FORMAT_GENERATOR)
  await writeSchemaDiagnostics()

  const summary = await collectBuildSummary(selected)
  console.log(color('--------------------------', 'green'))
  console.log(color(`Total Schema groups: ${summary.totalSchemaGroups}`, 'green'))
  console.log(color(`Total Schema: ${summary.totalSchemas}`, 'green'))
  console.log(color(`Total Definition: ${summary.totalDefinitions}`, 'green'))
  console.log(color(`Total formats: ${summary.totalFormats}`, 'green'))
  if (summary.totalWarnings > 0) {
    console.log(color(`${summary.totalWarnings} Warning`, 'yellow'))
    summary.warningItems.forEach((warning) => {
      console.log(`[${warning.scope}] ${warning.location} - ${warning.detail}`)
    })
  }
  if (summary.totalErrors > 0) {
    console.log(color(`${summary.totalErrors} Errors`, 'red'))
  }
}
