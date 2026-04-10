/**
 * Phase 3 Batch 8 communication+sensors+sources generator.
 * Fetches Signal K schemas/groups/communication.json, schemas/groups/sensors.json,
 * and schemas/groups/sources.json and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'communication-sensors-sources',
  batch: 'Batch 8',
  label: 'communication/sensors/sources schema module(s)',
  upstreamPaths: ['schemas/groups/communication.json', 'schemas/groups/sensors.json', 'schemas/groups/sources.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
