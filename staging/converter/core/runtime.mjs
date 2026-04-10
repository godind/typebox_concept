import { execFileSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { GROUPS } from '../config/groups.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(scriptDir, '../../..')
export const schemaArtifactsRoot = path.join(repoRoot, 'staging/schemas')
export const baselineRoot = path.join(repoRoot, 'staging/verification/baselines/latest')

const groupIndex = new Map()
for (const group of GROUPS) {
  groupIndex.set(group.name, group)
  for (const alias of group.aliases) groupIndex.set(alias, group)
}

export function parseRequestedGroups(argv) {
  const groups = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] !== '--group') continue
    const raw = argv[i + 1]
    if (!raw) throw new Error('Missing value for --group')
    groups.push(...raw.split(',').map((part) => part.trim()).filter(Boolean))
    i++
  }
  return groups
}

export function resolveGroups(requestedNames) {
  if (requestedNames.length === 0) return GROUPS

  const selected = []
  const seen = new Set()
  for (const name of requestedNames) {
    const group = groupIndex.get(name)
    if (!group) {
      throw new Error(`Unknown group '${name}'. Valid groups: ${GROUPS.map((g) => g.name).join(', ')}`)
    }
    if (!seen.has(group.name)) {
      selected.push(group)
      seen.add(group.name)
    }
  }
  return selected
}

export function runNodeScript(filePath) {
  execFileSync(process.execPath, [filePath], {
    cwd: repoRoot,
    stdio: 'inherit'
  })
}

export function runNpmScript(scriptName) {
  execFileSync('npm', ['run', scriptName], {
    cwd: repoRoot,
    stdio: 'inherit'
  })
}
