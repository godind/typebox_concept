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

runGroupBatch({
  outDir: __dirname,
  scope: 'notifications',
  batch: 'Batch 9',
  label: 'notifications schema module(s)',
  upstreamPaths: ['schemas/groups/notifications.json'],
  converterCtx: createConverterContext({ extraProvers: [proveNotificationsDisjoint] }),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
