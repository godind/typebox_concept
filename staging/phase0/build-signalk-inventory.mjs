#!/usr/bin/env node

/**
 * Phase 0 staging utility.
 * Builds a machine-readable inventory of Signal K schemas and inter-schema refs
 * from the upstream specification repository.
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const OWNER = 'SignalK'
const REPO = 'specification'
const BRANCH = process.env.SIGNALK_REF || 'master'
const TREE_API = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${encodeURIComponent(BRANCH)}?recursive=1`
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`
const OUTPUT_PATH = path.resolve(process.cwd(), 'staging/phase0/signalk-schema-inventory.json')

function toSchemaKind(schemaPath) {
  if (schemaPath.startsWith('schemas/groups/')) return 'group'
  if (schemaPath.startsWith('schemas/messages/')) return 'message'
  if (schemaPath.startsWith('schemas/external/')) return 'external'
  return 'root'
}

function parseRefs(obj, refs = []) {
  if (!obj || typeof obj !== 'object') return refs

  if (Object.hasOwn(obj, '$ref') && typeof obj.$ref === 'string') {
    refs.push(obj.$ref)
  }

  if (Array.isArray(obj)) {
    for (const entry of obj) parseRefs(entry, refs)
    return refs
  }

  for (const value of Object.values(obj)) parseRefs(value, refs)
  return refs
}

function normalizeRef(currentPath, ref) {
  if (ref.startsWith('#')) {
    return {
      kind: 'internal',
      targetFile: currentPath,
      targetPointer: ref
    }
  }

  const [filePart, pointer = ''] = ref.split('#')

  // Detect absolute URLs early (http://, https://, file://, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(filePart)) {
    return {
      kind: 'external-url-or-other',
      targetFile: filePart,
      targetPointer: pointer ? `#${pointer}` : ''
    }
  }

  const currentDir = path.posix.dirname(currentPath)
  const resolved = path.posix.normalize(path.posix.join(currentDir, filePart))

  if (!resolved.startsWith('schemas/')) {
    return {
      kind: 'external-url-or-other',
      targetFile: filePart,
      targetPointer: pointer ? `#${pointer}` : ''
    }
  }

  return {
    kind: 'local-file',
    targetFile: resolved,
    targetPointer: pointer ? `#${pointer}` : ''
  }
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'typebox_concept-phase0-inventory'
    }
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} (${url})`)
  }

  return response.json()
}

async function main() {
  const tree = await getJson(TREE_API)
  const entries = Array.isArray(tree.tree) ? tree.tree : []

  const schemaEntries = entries
    .filter((entry) => entry.type === 'blob' && entry.path.startsWith('schemas/') && entry.path.endsWith('.json'))
    .sort((a, b) => a.path.localeCompare(b.path))

  const schemaDocs = []

  for (const entry of schemaEntries) {
    const rawUrl = `${RAW_BASE}/${entry.path}`
    const schemaJson = await getJson(rawUrl)
    const refs = parseRefs(schemaJson)
    const normalizedRefs = refs.map((ref) => normalizeRef(entry.path, ref))

    schemaDocs.push({
      path: entry.path,
      sha: entry.sha,
      size: entry.size,
      kind: toSchemaKind(entry.path),
      id: typeof schemaJson.id === 'string' ? schemaJson.id : null,
      title: typeof schemaJson.title === 'string' ? schemaJson.title : null,
      description: typeof schemaJson.description === 'string' ? schemaJson.description : null,
      refs: normalizedRefs
    })
  }

  const summary = {
    totalSchemas: schemaDocs.length,
    byKind: {
      root: schemaDocs.filter((doc) => doc.kind === 'root').length,
      group: schemaDocs.filter((doc) => doc.kind === 'group').length,
      message: schemaDocs.filter((doc) => doc.kind === 'message').length,
      external: schemaDocs.filter((doc) => doc.kind === 'external').length
    },
    schemasWithRefs: schemaDocs.filter((doc) => doc.refs.length > 0).length,
    totalRefs: schemaDocs.reduce((acc, doc) => acc + doc.refs.length, 0)
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      owner: OWNER,
      repo: REPO,
      ref: BRANCH,
      treeApi: TREE_API,
      rawBase: RAW_BASE
    },
    summary,
    schemas: schemaDocs
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

  console.log(`Wrote ${OUTPUT_PATH}`)
  console.log(`Schemas: ${summary.totalSchemas}, refs: ${summary.totalRefs}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
