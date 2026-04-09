/**
 * Phase 2 sample converter.
 * Fetches upstream definitions.json, applies converter rules, emits TypeBox TypeScript.
 * Output is for parity verification only — not promoted to src/lib until Gate C approval.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'sample-parity')
const UPSTREAM_BASE = 'https://raw.githubusercontent.com/SignalK/specification/master'
const UPSTREAM_REF = 'master'
const UPSTREAM_PATH = 'schemas/definitions.json'
const ID_PREFIX = `signalk://schemas/${UPSTREAM_PATH.replace(/^schemas\//, '').replace('.json', '')}#`

// ── Rule helpers ─────────────────────────────────────────────────────────────

const EXTERNAL_REF_ALLOWLIST = new Set()
const EXCEPTIONS = []
const WARNINGS = []

function logException(kind, location, detail) {
  EXCEPTIONS.push({ kind, location, detail })
}

function logWarning(location, detail) {
  WARNINGS.push({ location, detail })
}

function toPascalCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function definitionId(defName) {
    return `${ID_PREFIX}${toPascalCase(defName)}`
}

function constraintOptions(schema) {
  const keys = [
    'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum',
    'multipleOf', 'minLength', 'maxLength', 'minItems', 'maxItems',
    'format', 'pattern'
  ]
  const opts = {}
  if (schema['$id']) opts['$id'] = schema['$id']
  for (const k of keys) {
    if (schema[k] !== undefined) opts[k] = schema[k]
  }
  if (schema.description) opts.description = schema.description
  if (schema.title) opts.title = schema.title
  if (schema.default !== undefined) opts.default = schema.default
  if (schema.example !== undefined) opts.examples = [schema.example]
  return Object.keys(opts).length ? opts : null
}

function optsStr(opts) {
  if (!opts) return ''
  return ', ' + JSON.stringify(opts)
}

function typeFromName(typeName, opts) {
    switch (typeName) {
        case 'string': return `Type.String(${opts ? JSON.stringify(opts) : ''})`
        case 'number': return `Type.Number(${opts ? JSON.stringify(opts) : ''})`
        case 'integer': return `Type.Integer(${opts ? JSON.stringify(opts) : ''})`
        case 'boolean': return 'Type.Boolean()'
        case 'null': return 'Type.Null()'
        case 'object': return `Type.Object(${opts ? JSON.stringify(opts) : '{}'})`
        case 'array': return `Type.Array(Type.Unknown()${opts ? ', ' + JSON.stringify(opts) : ''})`
        default: return 'Type.Unknown()'
    }
}

// Convert a single JSON Schema node to a TypeBox expression string.
function toTypebox(schema, context, indent = 0) {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (!schema || typeof schema !== 'object') return 'Type.Unknown() /* invalid schema node */'

  // $ref — T09/T10/T16
  if (schema['$ref']) {
    const ref = schema['$ref']
    if (/^https?:\/\//.test(ref)) {
      // T16: external URL ref
      EXTERNAL_REF_ALLOWLIST.add(ref)
      return `Type.Any() /* external ref: ${ref} */`
    }
    const defMatch = ref.match(/^#\/definitions\/(.+)$/)
    if (defMatch) {
      // T09: same-file ref
        return `Type.Ref(${JSON.stringify(definitionId(defMatch[1]))})`
    }
    const crossMatch = ref.match(/definitions\.json#\/definitions\/(.+)$/)
    if (crossMatch) {
      // T10: cross-file ref to foundation
        return `Type.Ref(${JSON.stringify(definitionId(crossMatch[1]))})`
    }
    logWarning(context, `unresolved $ref: ${ref}`)
    return `Type.Unknown() /* unresolved ref: ${ref} */`
  }

  // type: ['X', 'null'] — T08
  if (Array.isArray(schema.type)) {
    const nonNull = schema.type.filter(t => t !== 'null')
    const hasNull = schema.type.includes('null')
      if (nonNull.length === 0) {
          if (hasNull) return 'Type.Null()'
          logWarning(context, 'empty type array; emitted Type.Unknown()')
          return 'Type.Unknown()'
      }

      if (nonNull.length > 1) {
          const opts = constraintOptions(schema)
          const members = nonNull.map(t => typeFromName(t, opts))
          const allMembers = hasNull ? [...members, 'Type.Null()'] : members
          return `Type.Union([${allMembers.join(', ')}])`
      }

    const baseSchema = { ...schema, type: nonNull.length === 1 ? nonNull[0] : nonNull }
    const baseExpr = toTypebox(baseSchema, context, indent)
      return hasNull ? `Type.Union([${baseExpr}, Type.Null()])` : baseExpr
  }

  // enum — T14
  if (schema.enum) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const lits = schema.enum.map(v => {
      if (typeof v === 'string') return `Type.Literal(${JSON.stringify(v)})`
      if (typeof v === 'number') return `Type.Literal(${v})`
      return `Type.Literal(${JSON.stringify(v)})`
    })
    if (lits.length === 1) return lits[0]
    return `Type.Union([\n${lits.map(l => innerPad + l).join(',\n')}\n${pad}]${idOpt})`
  }

  // allOf — T11
  if (schema.allOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const members = schema.allOf.map(s => innerPad + toTypebox(s, context, indent + 1))
    return `Type.Intersect([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  // anyOf — T12
  if (schema.anyOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const members = schema.anyOf.map(s => innerPad + toTypebox(s, context, indent + 1))
    return `Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  // oneOf — T13
    if (schema.oneOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
        // Restore oneOf exclusivity for plain-object branches by closing dominated
        // branches (strict property-key subset of another branch).
        const isPlainObjectBranch = s =>
            (s.type === 'object' || (!s.type && s.properties)) &&
            !s['$ref'] && !s.oneOf && !s.anyOf && !s.allOf && !s.enum
        if (schema.oneOf.every(isPlainObjectBranch)) {
            const propKeys = s => Object.keys(s.properties || {})
            const dominated = new Set()
            for (let i = 0; i < schema.oneOf.length; i++) {
                const ki = propKeys(schema.oneOf[i])
                for (let j = 0; j < schema.oneOf.length; j++) {
                    if (i === j) continue
                    const kj = propKeys(schema.oneOf[j])
                    if (ki.length < kj.length && ki.every(k => kj.includes(k))) {
                        dominated.add(i)
                    }
                }
            }
            if (dominated.size > 0) {
                const members = schema.oneOf.map((s, i) => {
                    const patched = dominated.has(i) ? { ...s, additionalProperties: false } : s
                    return innerPad + toTypebox(patched, context, indent + 1)
                })
                return `/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) ${[...dominated].join(',')} */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
            }
        }
        logException('semantic-loss', context, 'oneOf mapped to Type.Union; exclusive single-match not enforced')
    const members = schema.oneOf.map(s => innerPad + toTypebox(s, context, indent + 1))
        return `/* oneOf->Union: exclusive constraint not enforced */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  const opts = constraintOptions(schema)

  // Implicit object: has properties/required/patternProperties but no explicit type — T07/T15 still apply
  if (!schema.type && (schema.properties || schema.patternProperties)) {
    return toTypebox({ ...schema, type: 'object' }, context, indent)
  }

  switch (schema.type) {
    case 'string':  return `Type.String(${opts ? JSON.stringify(opts) : ''})`
    case 'number':  return `Type.Number(${opts ? JSON.stringify(opts) : ''})`
    case 'integer': return `Type.Integer(${opts ? JSON.stringify(opts) : ''})`
    case 'boolean': return `Type.Boolean()`
    case 'null':    return `Type.Null()`

    case 'array': {
      const itemExpr = schema.items
        ? (Array.isArray(schema.items)
          ? (schema.items.length ? toTypebox(schema.items[0], context + '.items', indent) : 'Type.Unknown()')
          : toTypebox(schema.items, context + '.items', indent))
        : 'Type.Unknown()'
      const arrOpts = {}
      if (schema.minItems !== undefined) arrOpts.minItems = schema.minItems
      if (schema.maxItems !== undefined) arrOpts.maxItems = schema.maxItems
      return `Type.Array(${itemExpr}${Object.keys(arrOpts).length ? ', ' + JSON.stringify(arrOpts) : ''})`
    }

    case 'object': {
      const lines = []

      // patternProperties — T15
      if (schema.patternProperties && !schema.properties) {
        const patterns = Object.entries(schema.patternProperties)
        if (patterns.length === 1 && patterns[0][0] === '.*') {
          const valExpr = toTypebox(patterns[0][1], context + '.patternProperties.*', indent + 1)
          return `Type.Record(Type.String(), ${valExpr})`
        }
        const [pat, patSchema] = patterns[0]
        const valExpr = toTypebox(patSchema, context + '.patternProperties', indent + 1)
        return `Type.Record(Type.RegExp(${JSON.stringify(pat)}), ${valExpr})`
      }

      // Regular object with properties
      if (schema.properties) {
        const required = new Set(schema.required || [])
        const propEntries = Object.entries(schema.properties)
          .sort(([a], [b]) => a.localeCompare(b)) // B4: alphabetical ordering
          .map(([key, propSchema]) => {
            const expr = toTypebox(propSchema, `${context}.${key}`, indent + 2)
            const wrapped = required.has(key) ? expr : `Type.Optional(${expr})`
            return `${innerPad}  ${JSON.stringify(key)}: ${wrapped}`
          })
        lines.push(...propEntries)
      }

      const objOpts = {}
      if (schema['$id']) objOpts['$id'] = schema['$id']
      if (opts?.description) objOpts.description = opts.description
      if (opts?.title) objOpts.title = opts.title
          if (schema.additionalProperties === false) objOpts.additionalProperties = false
      // B2: do NOT set additionalProperties: false by default

      const body = lines.length ? `{\n${lines.join(',\n')}\n${innerPad}}` : '{}'
      return `Type.Object(${body}${Object.keys(objOpts).length ? ', ' + JSON.stringify(objOpts) : ''})`
    }

    default:
      if (Object.keys(schema).length === 0) return 'Type.Unknown()'
      logWarning(context, `no type field; emitting Type.Unknown for: ${JSON.stringify(schema).slice(0,80)}`)
      return 'Type.Unknown()'
  }
}

function collectDefinitionRefs(node, refs = new Set()) {
    if (!node || typeof node !== 'object') return refs
    if (Array.isArray(node)) {
        for (const item of node) collectDefinitionRefs(item, refs)
        return refs
    }

    if (typeof node['$ref'] === 'string') {
        const ref = node['$ref']
        const same = ref.match(/^#\/definitions\/(.+)$/)
        const cross = ref.match(/definitions\.json#\/definitions\/(.+)$/)
        const target = same?.[1] || cross?.[1]
        if (target) refs.add(target)
    }

    for (const value of Object.values(node)) {
        collectDefinitionRefs(value, refs)
    }
    return refs
}

function orderDefinitions(defs) {
    const keys = Object.keys(defs)
    const graph = new Map()
    for (const key of keys) {
        const refs = Array.from(collectDefinitionRefs(defs[key])).filter(r => defs[r])
        graph.set(key, refs)
    }

    const ordered = []
    const state = new Map()

    function visit(node) {
        const status = state.get(node)
        if (status === 'done') return
        if (status === 'visiting') {
            logWarning(`${UPSTREAM_PATH}#/definitions/${node}`, 'cyclic ref detected; preserving insertion order fallback')
            return
        }
        state.set(node, 'visiting')
        const deps = graph.get(node) || []
        deps.sort((a, b) => a.localeCompare(b))
        for (const dep of deps) visit(dep)
        state.set(node, 'done')
        ordered.push(node)
    }

    const roots = [...keys].sort((a, b) => a.localeCompare(b))
    for (const key of roots) visit(key)
    return ordered
}

function expandSampleDefinitions(allDefs, requestedKeys) {
    const included = new Set()

    function visit(key) {
        if (included.has(key) || !allDefs[key]) return
        included.add(key)
        const refs = Array.from(collectDefinitionRefs(allDefs[key]))
        for (const ref of refs) visit(ref)
    }

    for (const key of requestedKeys) visit(key)
    return Object.fromEntries([...included].sort((a, b) => a.localeCompare(b)).map(key => [key, allDefs[key]]))
}

// ── Emit a definitions file from upstream JSON Schema ───────────────────────

function emitDefinitionsModule(upstreamSchema, filePath, upstreamPath) {
  const defs = upstreamSchema.definitions || {}
    const orderedKeys = orderDefinitions(defs)
  const lines = []

  lines.push(`// Generated from SignalK specification ${UPSTREAM_REF} — do not edit manually`)
  lines.push(`// Source: ${UPSTREAM_BASE}/${upstreamPath}`)
  lines.push(`import { Type } from 'typebox'`)
  lines.push(``)

    for (const key of orderedKeys) {
        const defSchema = defs[key]
    const name = toPascalCase(key) + 'Schema'
      const id = definitionId(key)
    const context = `${upstreamPath}#/definitions/${key}`

    // Inject $id into schema options before converting
    const withId = { ...defSchema, $id: id }
    const expr = toTypebox(withId, context, 0)

    lines.push(`export const ${name} = ${expr}`)
    lines.push(`export type ${toPascalCase(key)} = Type.Static<typeof ${name}>`)
      lines.push(``)
  }

  return lines.join('\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const resp = await fetch(`${UPSTREAM_BASE}/${UPSTREAM_PATH}`)
  if (!resp.ok) throw new Error(`fetch failed: ${resp.status}`)
  const schema = await resp.json()

    // Emit a focused sample that includes oneOf coverage via meta.displayScale inside meta.
    const SAMPLE_DEFS = ['timestamp', 'sourceRef', 'mmsi', 'alarmState', 'numberValue', 'position', 'meta']
  const sampledSchema = {
    ...schema,
      definitions: expandSampleDefinitions(schema.definitions || {}, SAMPLE_DEFS)
  }

    const output = emitDefinitionsModule(sampledSchema, UPSTREAM_PATH, UPSTREAM_PATH)
  const outFile = path.join(OUT_DIR, 'definitions-sample.ts')
  fs.writeFileSync(outFile, output, 'utf8')

  // Write manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    upstreamRef: UPSTREAM_REF,
    sampledDefinitions: SAMPLE_DEFS,
    exceptions: EXCEPTIONS,
    warnings: WARNINGS,
    externalRefAllowlist: Array.from(EXTERNAL_REF_ALLOWLIST)
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`Wrote ${outFile}`)
  console.log(`Exceptions: ${EXCEPTIONS.length}, Warnings: ${WARNINGS.length}`)
  console.log(`External refs: ${EXTERNAL_REF_ALLOWLIST.size}`)
}

main().catch(e => { console.error(e); process.exit(1) })
