import { GROUPS, RUNTIME_FORMAT_GENERATOR } from '../config/groups.mjs'
import { parseRequestedGroups, resolveGroups, runNodeScript } from '../core/runtime.mjs'

const requested = parseRequestedGroups(process.argv.slice(2))
const selected = resolveGroups(requested)

console.log(`Building schema groups: ${selected.map((group) => group.name).join(', ')}`)

for (const group of selected) {
  runNodeScript(group.generator)
}

if (selected.length > 0) {
  runNodeScript(RUNTIME_FORMAT_GENERATOR)
}

console.log(`Completed schema build for ${selected.length} group(s).`)
console.log(`Available groups: ${GROUPS.map((group) => group.name).join(', ')}`)
