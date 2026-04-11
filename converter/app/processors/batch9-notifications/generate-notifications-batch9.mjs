/**
 * Phase 3 Batch 9 notifications generator.
 * Fetches Signal K schemas/groups/notifications.json
 * and emits TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext, proveNotificationsDisjoint } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function applyNotificationsOverrides(schema, upstreamPath) {
  if (upstreamPath !== 'schemas/groups/notifications.json') return schema
  if (!schema || typeof schema !== 'object') return schema

  const valueProperties = schema.definitions?.notification?.allOf?.[1]?.properties?.value?.properties
  if (!valueProperties || typeof valueProperties !== 'object') return schema

  valueProperties.status = {
    type: 'object',
    properties: {
      silenced: { type: 'boolean' },
      acknowledged: { type: 'boolean' },
      canSilence: { type: 'boolean' },
      canAcknowledge: { type: 'boolean' },
      canClear: { type: 'boolean' }
    },
    required: ['silenced', 'acknowledged', 'canSilence', 'canAcknowledge', 'canClear']
  }
  valueProperties.position = {
    $ref: '../definitions.json#/definitions/position'
  }
  valueProperties.createdAt = {
    $ref: '../definitions.json#/definitions/timestamp'
  }
  valueProperties.id = {
    type: 'string'
  }

  return schema
}

runGroupBatch({
  outDir: __dirname,
  scope: 'notifications',
  batch: 'Batch 9',
  label: 'notifications schema module(s)',
  upstreamPaths: ['schemas/groups/notifications.json'],
  converterCtx: createConverterContext({ extraProvers: [proveNotificationsDisjoint] }),
  schemaMutator: applyNotificationsOverrides,
}).catch(error => {
  console.error(error)
  process.exit(1)
})
