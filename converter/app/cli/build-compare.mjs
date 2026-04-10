import process from 'node:process'
import { captureBaselineSnapshot, diffAgainstBaseline } from '../core/snapshot-diff.mjs'
import { runNodeScript } from '../core/runtime.mjs'

await captureBaselineSnapshot()
console.log('Baseline snapshot captured. Running full schema build...')

runNodeScript('converter/app/cli/build.mjs')

const hasDiff = await diffAgainstBaseline()
if (!hasDiff) {
  console.log('No diffs detected after full build.')
  process.exit(0)
}

console.log('Diffs detected after full build.')
process.exit(1)
