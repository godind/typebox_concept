/**
 * Phase 3 Batch 4 electrical generator.
 * Fetches Signal K schemas/groups/electrical.json and emits a TypeBox module
 * for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'electrical',
  batch: 'Batch 4',
  label: 'electrical schema module(s)',
  upstreamPaths: ['schemas/groups/electrical.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
