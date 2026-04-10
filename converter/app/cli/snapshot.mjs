import { captureBaselineSnapshot } from '../core/snapshot-diff.mjs'

await captureBaselineSnapshot()
console.log('Captured baseline schema snapshot.')
