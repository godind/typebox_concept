/**
 * Phase 3 Batch 3 environment generator.
 * Fetches Signal K schemas/groups/environment.json and emits a TypeBox module
 * for staging review.
 *
 * Format registry pre-scan results (April 2026, full-spec audit):
 *   - ^[a-zA-Z0-9/+-]+$  (timezoneRegion): intentionally unmapped — generic
 *     timezone region string; pattern enforcement from the schema is sufficient.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'environment',
  batch: 'Batch 3',
  label: 'environment schema module(s)',
  upstreamPaths: ['schemas/groups/environment.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
