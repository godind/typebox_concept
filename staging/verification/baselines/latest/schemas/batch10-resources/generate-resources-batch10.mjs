/**
 * Phase 3 Batch 10 resources generator.
 * Fetches Signal K schemas/groups/resources.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext, proveNotificationsDisjoint, proveEnumPropertyDiscriminatorDisjoint, proveResourcesGeometryDisjoint, GEOJSON_EXTERNAL_REF_OVERRIDES } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'resources',
  batch: 'Batch 10',
  label: 'resources schema module(s)',
  upstreamPaths: ['schemas/groups/resources.json'],
  converterCtx: createConverterContext({
    extraProvers: [proveResourcesGeometryDisjoint, proveEnumPropertyDiscriminatorDisjoint, proveNotificationsDisjoint],
    externalRefTypeOverrides: GEOJSON_EXTERNAL_REF_OVERRIDES,
    fixupTypoRefs: true,
  }),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
