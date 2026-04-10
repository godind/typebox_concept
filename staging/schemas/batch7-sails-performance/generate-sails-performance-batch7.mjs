/**
 * Phase 3 Batch 7 sails+performance generator.
 * Fetches Signal K schemas/groups/sails.json and schemas/groups/performance.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'sails-performance',
  batch: 'Batch 7',
  label: 'sails/performance schema module(s)',
  upstreamPaths: ['schemas/groups/sails.json', 'schemas/groups/performance.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
