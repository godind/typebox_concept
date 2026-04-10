/**
 * Phase 3 Batch 6 tanks+design generator.
 * Fetches Signal K schemas/groups/tanks.json and schemas/groups/design.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'tanks-design',
  batch: 'Batch 6',
  label: 'tanks/design schema module(s)',
  upstreamPaths: ['schemas/groups/tanks.json', 'schemas/groups/design.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
