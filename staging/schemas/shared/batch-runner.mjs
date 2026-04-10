/**
 * Shared batch runner for Signal K group-schema generators (batches 1-11).
 * Encapsulates emitRootModule, loadSchema, barrel writing, manifest writing,
 * and standard console output so each generator reduces to a pure config stub.
 */
import fs from 'node:fs'
import path from 'node:path'
import { toPascalCase, schemaBaseName, rootId } from './typebox-converter.mjs'
import { deterministicGeneratedAt, writeManifest } from './generator-common.mjs'

export const UPSTREAM_BASE = 'https://raw.githubusercontent.com/SignalK/specification/master'
export const UPSTREAM_REF = 'master'

function emitRootModule(schema, upstreamPath, toTypebox) {
  const schemaName = `${toPascalCase(schemaBaseName(upstreamPath))}Schema`
  const typeName = toPascalCase(schemaBaseName(upstreamPath))
  const withId = { ...schema, $id: rootId(upstreamPath) }
  const expr = toTypebox(withId, `${upstreamPath}#`, upstreamPath, 0)

  const lines = [
    `// Generated from SignalK specification ${UPSTREAM_REF} - do not edit manually`,
    `// Source: ${UPSTREAM_BASE}/${upstreamPath}`,
    `import { Type } from 'typebox'`,
    ``,
    `export const ${schemaName} = ${expr}`,
    `export type ${typeName} = Type.Static<typeof ${schemaName}>`,
  ]

  if (schema.definitions && typeof schema.definitions === 'object') {
    const entries = Object.entries(schema.definitions).sort(([a], [b]) => a.localeCompare(b))
    for (const [defName, defSchema] of entries) {
      const defSchemaName = `${toPascalCase(defName)}Schema`
      const defTypeName = toPascalCase(defName)
      const defId = `${rootId(upstreamPath)}#${toPascalCase(defName)}`
      const withDefId = { ...(defSchema && typeof defSchema === 'object' ? defSchema : {}), $id: defId }
      const defExpr = toTypebox(withDefId, `${upstreamPath}#/definitions/${defName}`, upstreamPath, 0)
      lines.push(`export const ${defSchemaName} = ${defExpr}`)
      lines.push(`export type ${defTypeName} = Type.Static<typeof ${defSchemaName}>`)
    }
  }
  lines.push('')

  return { schemaName, typeName, source: lines.join('\n') }
}

async function loadSchema(upstreamPath) {
  const response = await fetch(`${UPSTREAM_BASE}/${upstreamPath}`)
  if (!response.ok) throw new Error(`fetch failed for ${upstreamPath}: ${response.status}`)
  return response.json()
}

/**
 * @param {object} options
 * @param {string}   options.outDir        - absolute path to the batch output directory
 * @param {string}   options.scope         - manifest scope (e.g. 'navigation')
 * @param {string}   options.batch         - manifest batch label (e.g. 'Batch 2')
 * @param {string}   options.label         - human-readable label for console output
 * @param {string[]} options.upstreamPaths - Signal K schema paths relative to upstream base
 * @param {object}   options.converterCtx  - result of createConverterContext()
 */
export async function runGroupBatch({ outDir, scope, batch, label, upstreamPaths, converterCtx }) {
  const { toTypebox, EXTERNAL_REF_ALLOWLIST, EXCEPTIONS, WARNINGS, FORMAT_TRACE } = converterCtx
  const targetOutDir = process.env.SCHEMA_OUTPUT_ROOT
    ? path.join(process.env.SCHEMA_OUTPUT_ROOT, scope)
    : outDir

  fs.mkdirSync(targetOutDir, { recursive: true })

  const outputs = []
  for (const upstreamPath of upstreamPaths) {
    const schema = await loadSchema(upstreamPath)
    const emitted = emitRootModule(schema, upstreamPath, toTypebox)
    const fileName = `${schemaBaseName(upstreamPath)}.ts`
    fs.writeFileSync(path.join(targetOutDir, fileName), emitted.source, 'utf8')
    outputs.push({ upstreamPath, outputFile: fileName, schemaName: emitted.schemaName, typeName: emitted.typeName })
  }

  const barrel = outputs
    .map(({ outputFile, schemaName, typeName }) =>
      `export { ${schemaName} } from './${outputFile.replace('.ts', '.js')}'\n` +
      `export type { ${typeName} } from './${outputFile.replace('.ts', '.js')}'`)
    .join('\n\n') + '\n'
  fs.writeFileSync(path.join(targetOutDir, 'index.ts'), barrel, 'utf8')

  const manifest = {
    phase: 'Phase 3',
    batch,
    scope,
    generatedAt: deterministicGeneratedAt(),
    upstreamRef: UPSTREAM_REF,
    upstreamPaths,
    outputs,
    exceptions: EXCEPTIONS,
    warnings: WARNINGS,
    externalRefAllowlist: Array.from(EXTERNAL_REF_ALLOWLIST),
    formatMappingsApplied: FORMAT_TRACE.applied,
    unmappedFormatCandidates: FORMAT_TRACE.unmapped
  }
  writeManifest(targetOutDir, manifest)

  console.log(`Wrote ${outputs.length} ${label} to ${targetOutDir}`)
  console.log(`Exceptions: ${EXCEPTIONS.length}, Warnings: ${WARNINGS.length}`)
  console.log(`Unmapped format candidates: ${FORMAT_TRACE.unmapped.length}`)
  console.log(`Format mappings applied: ${FORMAT_TRACE.applied.length}`)
}
