/**
 * Phase 3 Batch 2 navigation generator.
 * Fetches Signal K schemas/groups/navigation.json and emits a TypeBox module
 * for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'navigation',
  batch: 'Batch 2',
  label: 'navigation schema module(s)',
  upstreamPaths: ['schemas/groups/navigation.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
