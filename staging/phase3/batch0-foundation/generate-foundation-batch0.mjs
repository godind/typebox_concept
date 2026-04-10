/**
 * Phase 3 Batch 0 foundation generator.
 * Fetches Signal K schemas/definitions.json and emits full TypeBox foundation module.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { applyFormatMapping, createFormatTrace } from '../format-mapping-registry.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = __dirname
const UPSTREAM_BASE = 'https://raw.githubusercontent.com/SignalK/specification/master'
const UPSTREAM_REF = 'master'
const UPSTREAM_PATH = 'schemas/definitions.json'
const ID_PREFIX = `signalk://schemas/${UPSTREAM_PATH.replace(/^schemas\//, '').replace('.json', '')}#`

const EXTERNAL_REF_ALLOWLIST = new Set()
const EXCEPTIONS = []
const WARNINGS = []
const FORMAT_TRACE = createFormatTrace()

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

function constraintOptions(schema, context) {
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
    const mappedFormat = applyFormatMapping(schema, context, FORMAT_TRACE)
    if (mappedFormat !== undefined && opts.format === undefined) {
        opts.format = mappedFormat
    }
  if (schema.description) opts.description = schema.description
  if (schema.title) opts.title = schema.title
  if (schema.default !== undefined) opts.default = schema.default
  if (schema.example !== undefined) opts.examples = [schema.example]
  return Object.keys(opts).length ? opts : null
}

function typeFromName(typeName, opts) {
  switch (typeName) {
    case 'string':
      return `Type.String(${opts ? JSON.stringify(opts) : ''})`
    case 'number':
      return `Type.Number(${opts ? JSON.stringify(opts) : ''})`
    case 'integer':
      return `Type.Integer(${opts ? JSON.stringify(opts) : ''})`
    case 'boolean':
      return 'Type.Boolean()'
    case 'null':
      return 'Type.Null()'
    case 'object':
      return 'Type.Object({})'
    case 'array':
      return 'Type.Array(Type.Unknown())'
    default:
      return 'Type.Unknown()'
  }
}

function inferImplicitType(schema, parentType) {
  if (schema.type) return schema.type
  if (schema.pattern || schema.minLength !== undefined || schema.maxLength !== undefined) return 'string'
  if (schema.items || schema.minItems !== undefined || schema.maxItems !== undefined) return 'array'
  if (schema.properties || schema.patternProperties || schema.additionalProperties !== undefined) return 'object'
  if (parentType && ['string', 'array', 'object', 'number', 'integer', 'boolean'].includes(parentType)) return parentType
  return undefined
}

function enrichOneOfBranch(branch, parentSchema) {
  const next = { ...branch }
  const inferredType = inferImplicitType(next, parentSchema.type)
  if (!next.type && inferredType) next.type = inferredType

  if (!next.type && Array.isArray(next.required) && parentSchema.properties) {
    next.type = 'object'
  }

  if ((next.type === 'object' || (!next.type && next.required)) && parentSchema.properties) {
    const nextProps = { ...(next.properties || {}) }
    for (const key of next.required || []) {
      if (nextProps[key] === undefined && parentSchema.properties[key]) {
        nextProps[key] = parentSchema.properties[key]
      }
    }
    if (Object.keys(nextProps).length > 0) {
      next.properties = nextProps
    }
  }

  if ((next.type === 'object' || (!next.type && next.properties)) && parentSchema.properties && next.properties) {
    next.properties = Object.fromEntries(
      Object.entries(next.properties).map(([key, value]) => {
        if (value && typeof value === 'object' && Object.keys(value).length === 0 && parentSchema.properties[key]) {
          return [key, parentSchema.properties[key]]
        }
        return [key, value]
      })
    )
  }

  return next
}

function toTypebox(schema, context, indent = 0) {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (!schema || typeof schema !== 'object') return 'Type.Unknown() /* invalid schema node */'

  if (schema['$ref']) {
    const ref = schema['$ref']
    if (/^https?:\/\//.test(ref)) {
      EXTERNAL_REF_ALLOWLIST.add(ref)
      return `Type.Any() /* external ref: ${ref} */`
    }
    const defMatch = ref.match(/^#\/definitions\/(.+)$/)
    if (defMatch) return `Type.Ref(${JSON.stringify(definitionId(defMatch[1]))})`

    const crossMatch = ref.match(/definitions\.json#\/definitions\/(.+)$/)
    if (crossMatch) return `Type.Ref(${JSON.stringify(definitionId(crossMatch[1]))})`

    logWarning(context, `unresolved $ref: ${ref}`)
    return `Type.Unknown() /* unresolved ref: ${ref} */`
  }

  if (Array.isArray(schema.type)) {
    const nonNull = schema.type.filter(t => t !== 'null')
    const hasNull = schema.type.includes('null')
    if (nonNull.length === 0) {
      if (hasNull) return 'Type.Null()'
      logWarning(context, 'empty type array; emitted Type.Unknown()')
      return 'Type.Unknown()'
    }

    if (nonNull.length > 1) {
        const opts = constraintOptions(schema, context)
      const members = nonNull.map(t => typeFromName(t, opts))
      const allMembers = hasNull ? [...members, 'Type.Null()'] : members
      return `Type.Union([${allMembers.join(', ')}])`
    }

    const baseSchema = { ...schema, type: nonNull.length === 1 ? nonNull[0] : nonNull }
    const baseExpr = toTypebox(baseSchema, context, indent)
    return hasNull ? `Type.Union([${baseExpr}, Type.Null()])` : baseExpr
  }

  if (schema.enum) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const literals = schema.enum.map(v => {
      if (typeof v === 'string') return `Type.Literal(${JSON.stringify(v)})`
      if (typeof v === 'number') return `Type.Literal(${v})`
      return `Type.Literal(${JSON.stringify(v)})`
    })
    if (literals.length === 0) {
      logWarning(context, 'empty enum encountered; emitted Type.Never()')
      return 'Type.Never()'
    }
    if (literals.length === 1) return literals[0]
    return `Type.Union([\n${literals.map(l => innerPad + l).join(',\n')}\n${pad}]${idOpt})`
  }

  if (schema.allOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const members = schema.allOf.map(s => innerPad + toTypebox(s, context, indent + 1))
    return `Type.Intersect([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  if (schema.anyOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const variantSchemas = schema.anyOf.map(branch => enrichOneOfBranch(branch, schema))
    const members = variantSchemas.map(s => innerPad + toTypebox(s, context, indent + 1))
    return `Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

    if (schema.oneOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
        // Attempt to restore oneOf exclusivity: if ALL branches are plain object schemas (no $ref/
        // nested combiners), close any "dominated" branch (one whose property keys are a proper
        // subset of another branch's property keys) with additionalProperties:false. This prevents
        // a value with extra fields from matching the base branch when it should match a more
        // specific branch, restoring the intended oneOf single-match semantics without any custom
        // validator. Falls back to a plain Union + semantic-loss exception when the pattern does
        // not apply (e.g. non-object branches or $ref branches).
        const isPlainObjectBranch = s =>
            (s.type === 'object' || (!s.type && s.properties)) &&
            !s['$ref'] && !s.oneOf && !s.anyOf && !s.allOf && !s.enum
      const variantSchemas = schema.oneOf.map(branch => enrichOneOfBranch(branch, schema))
      if (variantSchemas.every(isPlainObjectBranch)) {
            const propKeys = s => Object.keys(s.properties || {})
            const dominated = new Set()
          for (let i = 0; i < variantSchemas.length; i++) {
            const ki = propKeys(variantSchemas[i])
            for (let j = 0; j < variantSchemas.length; j++) {
                    if (i === j) continue
              const kj = propKeys(variantSchemas[j])
                    // branch i is dominated by branch j when: ki ⊊ kj (strict subset by length, full overlap)
                    if (ki.length < kj.length && ki.every(k => kj.includes(k))) {
                        dominated.add(i)
                    }
                }
            }
            if (dominated.size > 0) {
                // Emit closed branches with additionalProperties:false; leave others untouched.
              const members = variantSchemas.map((s, i) => {
                    const patched = dominated.has(i) ? { ...s, additionalProperties: false } : s
                    return innerPad + toTypebox(patched, context, indent + 1)
                })
                return `/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) ${[...dominated].join(',')} */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
            }
        }
        logException('semantic-loss', context, 'oneOf mapped to Type.Union; exclusive single-match not enforced')
      const members = variantSchemas.map(s => innerPad + toTypebox(s, context, indent + 1))
    return `/* oneOf->Union: exclusive constraint not enforced */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

    const opts = constraintOptions(schema, context)

  if (!schema.type && (schema.properties || schema.patternProperties)) {
    return toTypebox({ ...schema, type: 'object' }, context, indent)
  }

  switch (schema.type) {
    case 'string':
      return `Type.String(${opts ? JSON.stringify(opts) : ''})`
    case 'number':
      return `Type.Number(${opts ? JSON.stringify(opts) : ''})`
    case 'integer':
      return `Type.Integer(${opts ? JSON.stringify(opts) : ''})`
    case 'boolean':
      return 'Type.Boolean()'
    case 'null':
      return 'Type.Null()'
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
      if (schema.patternProperties && !schema.properties) {
        const patterns = Object.entries(schema.patternProperties)
        if (patterns.length === 1) {
          const [pat, patSchema] = patterns[0]
          const valExpr = toTypebox(patSchema, pat === '.*' ? context + '.patternProperties.*' : context + '.patternProperties', indent + 1)
          const keyExpr = pat === '.*'
            ? 'Type.String()'
            : `Type.String({"pattern":${JSON.stringify(pat)}})`
          return `Type.Record(${keyExpr}, ${valExpr})`
        }
        const [pat, patSchema] = patterns[0]
        const valExpr = toTypebox(patSchema, context + '.patternProperties', indent + 1)
        logWarning(context, 'multiple patternProperties collapsed to first key pattern')
        return `Type.Record(Type.String({"pattern":${JSON.stringify(pat)}}), ${valExpr}) /* first pattern only */`
      }

      const propLines = []
      if (schema.properties) {
        const required = new Set(schema.required || [])
        const propEntries = Object.entries(schema.properties)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, propSchema]) => {
            const expr = toTypebox(propSchema, `${context}.${key}`, indent + 2)
            const wrapped = required.has(key) ? expr : `Type.Optional(${expr})`
            return `${innerPad}  ${JSON.stringify(key)}: ${wrapped}`
          })
        propLines.push(...propEntries)
      }

      const objOpts = {}
      if (schema['$id']) objOpts['$id'] = schema['$id']
      if (opts?.description) objOpts.description = opts.description
      if (opts?.title) objOpts.title = opts.title
          if (schema.additionalProperties === false) objOpts.additionalProperties = false

      const body = propLines.length ? `{\n${propLines.join(',\n')}\n${innerPad}}` : '{}'
      return `Type.Object(${body}${Object.keys(objOpts).length ? ', ' + JSON.stringify(objOpts) : ''})`
    }
    default:
      if (Object.keys(schema).length === 0) return 'Type.Unknown()'
      logWarning(context, `no type field; emitting Type.Unknown for: ${JSON.stringify(schema).slice(0, 80)}`)
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

function emitDefinitionsModule(schema) {
  const defs = schema.definitions || {}
  const orderedKeys = orderDefinitions(defs)
  const lines = []

  lines.push(`// Generated from SignalK specification ${UPSTREAM_REF} - do not edit manually`)
  lines.push(`// Source: ${UPSTREAM_BASE}/${UPSTREAM_PATH}`)
  lines.push(`import { Type } from 'typebox'`)
  lines.push('')

  for (const key of orderedKeys) {
    const schemaName = `${toPascalCase(key)}Schema`
    const id = definitionId(key)
    const context = `${UPSTREAM_PATH}#/definitions/${key}`
    const withId = { ...defs[key], $id: id }
    const expr = toTypebox(withId, context, 0)

    lines.push(`export const ${schemaName} = ${expr}`)
    lines.push(`export type ${toPascalCase(key)} = Type.Static<typeof ${schemaName}>`)
    lines.push('')
  }

  return { source: lines.join('\n'), orderedKeys }
}

async function main() {
  const resp = await fetch(`${UPSTREAM_BASE}/${UPSTREAM_PATH}`)
  if (!resp.ok) throw new Error(`fetch failed: ${resp.status}`)
  const schema = await resp.json()

  const { source, orderedKeys } = emitDefinitionsModule(schema)
  const outFile = path.join(OUT_DIR, 'foundation-definitions.ts')
  fs.writeFileSync(outFile, source, 'utf8')

  const manifest = {
    phase: 'Phase 3',
    batch: 'Batch 0',
    scope: 'foundation',
    generatedAt: new Date().toISOString(),
    upstreamRef: UPSTREAM_REF,
    upstreamPath: UPSTREAM_PATH,
    definitionCount: orderedKeys.length,
    orderedDefinitions: orderedKeys,
    exceptions: EXCEPTIONS,
    warnings: WARNINGS,
      externalRefAllowlist: Array.from(EXTERNAL_REF_ALLOWLIST),
      formatMappingsApplied: FORMAT_TRACE.applied,
      unmappedFormatCandidates: FORMAT_TRACE.unmapped
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`Wrote ${outFile}`)
  console.log(`Definitions: ${orderedKeys.length}`)
  console.log(`Exceptions: ${EXCEPTIONS.length}, Warnings: ${WARNINGS.length}`)
  console.log(`External refs: ${EXTERNAL_REF_ALLOWLIST.size}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
