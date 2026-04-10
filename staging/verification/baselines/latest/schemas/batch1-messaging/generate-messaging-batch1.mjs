/**
 * Phase 3 Batch 1 messaging/protocol generator.
 * Fetches Signal K schemas/delta.json, discovery.json, hello.json and emits
 * TypeBox modules for staging review.
 */
import { fileURLToPath } from 'url'
import path from 'path'
import { createConverterContext } from '../shared/typebox-converter.mjs'
import { runGroupBatch } from '../shared/batch-runner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

runGroupBatch({
  outDir: __dirname,
  scope: 'messaging',
  batch: 'Batch 1',
  label: 'messaging schema modules',
  upstreamPaths: ['schemas/delta.json', 'schemas/discovery.json', 'schemas/hello.json'],
  converterCtx: createConverterContext(),
}).catch(error => {
  console.error(error)
  process.exit(1)
})
