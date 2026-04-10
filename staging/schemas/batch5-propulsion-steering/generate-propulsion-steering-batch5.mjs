/**
 * Phase 3 Batch 5 propulsion+steering generator.
 * Fetches Signal K schemas/groups/propulsion.json and schemas/groups/steering.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'propulsion-steering',
  batch: 'Batch 5',
  label: 'propulsion/steering schema module(s)',
  upstreamPaths: ['schemas/groups/propulsion.json', 'schemas/groups/steering.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
