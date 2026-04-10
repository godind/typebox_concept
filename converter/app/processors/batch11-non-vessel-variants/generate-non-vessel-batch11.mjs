/**
 * Phase 3 Batch 11 non-vessel variants generator.
 * Fetches Signal K schemas/aircraft.json, schemas/aton.json, and schemas/sar.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext, proveNotificationsDisjoint, GEOJSON_EXTERNAL_REF_OVERRIDES } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'non-vessel-variants',
  batch: 'Batch 11',
  label: 'non-vessel variant schema module(s)',
  upstreamPaths: ['schemas/aircraft.json', 'schemas/aton.json', 'schemas/sar.json'],
  converterCtx: createConverterContext({
    extraProvers: [proveNotificationsDisjoint],
    externalRefTypeOverrides: GEOJSON_EXTERNAL_REF_OVERRIDES,
  }),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
