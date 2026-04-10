import process from 'node:process'
import { diffAgainstBaseline } from '../core/snapshot-diff.mjs'

const hasDiff = await diffAgainstBaseline()

if (!hasDiff) {
  console.log('No schema diffs detected against baseline snapshot.')
  process.exit(0)
}

console.log('Schema diffs detected against baseline snapshot.')
process.exit(1)
