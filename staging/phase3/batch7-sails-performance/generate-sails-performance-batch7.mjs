/**
 * Phase 3 Batch 7 sails+performance generator.
 * Fetches Signal K schemas/groups/sails.json and schemas/groups/performance.json
 * and emits TypeBox modules for staging review.
 * for staging review.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { applyFormatMapping, createFormatTrace } from '../format-mapping-registry.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = __dirname
const UPSTREAM_BASE = 'https://raw.githubusercontent.com/SignalK/specification/master'
const UPSTREAM_REF = 'master'
const UPSTREAM_PATHS = ['schemas/groups/sails.json', 'schemas/groups/performance.json']

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

function schemaBaseName(upstreamPath) {
  return path.basename(upstreamPath, '.json')
}

function rootId(upstreamPath) {
  return `signalk://schemas/${upstreamPath.replace(/^schemas\//, '').replace('.json', '')}`
}

function definitionId(upstreamPath, defName) {
  return `${rootId(upstreamPath)}#${toPascalCase(defName)}`
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

function resolveRef(upstreamPath, ref) {
  if (/^https?:\/\//.test(ref)) {
    EXTERNAL_REF_ALLOWLIST.add(ref)
    return `Type.Any() /* external ref: ${ref} */`
  }

  const localDefMatch = ref.match(/^#\/definitions\/(.+)$/)
  if (localDefMatch) return `Type.Ref(${JSON.stringify(definitionId(upstreamPath, localDefMatch[1]))})`

  const definitionsMatch = ref.match(/(?:\.\.\/)?definitions\.json#\/definitions\/(.+)$/)
  if (definitionsMatch) {
    return `Type.Ref(${JSON.stringify(definitionId('schemas/definitions.json', definitionsMatch[1]))})`
  }

  logWarning(`${upstreamPath}#`, `unresolved $ref: ${ref}`)
  return `Type.Unknown() /* unresolved ref: ${ref} */`
}

function intersectSets(a, b) {
  const out = new Set()
  for (const v of a) { if (b.has(v)) out.add(v) }
  return out
}

function extractLiteralSet(schema) {
  if (!schema || typeof schema !== 'object') return null
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return new Set(schema.enum)
  return null
}

function tupleBranchSignature(schema) {
  if (!schema || typeof schema !== 'object') return null
  if (schema.type !== 'array' || !Array.isArray(schema.items)) return null
  const len = schema.items.length
  const minItems = schema.minItems ?? len
  const maxItems = schema.maxItems ?? len
  const firstItemLiterals = extractLiteralSet(schema.items[0])
  return { minItems, maxItems, firstItemLiterals }
}

function proveTupleDisjoint(variantSchemas) {
  const signatures = variantSchemas.map(tupleBranchSignature)
  if (signatures.some(s => s === null)) return null
  for (let i = 0; i < signatures.length; i++) {
    for (let j = i + 1; j < signatures.length; j++) {
      const a = signatures[i]
      const b = signatures[j]
      const lengthOverlap = !(a.maxItems < b.minItems || b.maxItems < a.minItems)
      if (!lengthOverlap) continue
      if (a.firstItemLiterals && b.firstItemLiterals) {
        const overlap = intersectSets(a.firstItemLiterals, b.firstItemLiterals)
        if (overlap.size === 0) continue
      }
      return null
    }
  }
  return 'tuple branches are pairwise disjoint by length/literal position constraints'
}

function anchoredPrefixToken(pattern) {
  if (typeof pattern !== 'string') return null
  const match = pattern.match(/^\^([A-Za-z0-9_-]+)(?:\\\.|\.)/)
  return match ? match[1] : null
}

function proveStringPrefixDisjoint(variantSchemas) {
  const prefixes = []
  for (const schema of variantSchemas) {
    if (!schema || typeof schema !== 'object' || schema.type !== 'string' || typeof schema.pattern !== 'string') return null
    const token = anchoredPrefixToken(schema.pattern)
    if (!token) return null
    prefixes.push(token)
  }
  const unique = new Set(prefixes)
  if (unique.size !== prefixes.length) return null
  return `string branches are disjoint by anchored prefix tokens (${prefixes.join(', ')})`
}

function proveOneOfDisjoint(variantSchemas) {
  return proveTupleDisjoint(variantSchemas) || proveStringPrefixDisjoint(variantSchemas)
}

function toTypebox(schema, context, upstreamPath, indent = 0) {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (!schema || typeof schema !== 'object') return 'Type.Unknown() /* invalid schema node */'

  if (schema['$ref']) return resolveRef(upstreamPath, schema['$ref'])

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
    const baseSchema = { ...schema, type: nonNull[0] }
    const baseExpr = toTypebox(baseSchema, context, upstreamPath, indent)
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
    if (literals.length === 0) { logWarning(context, 'empty enum; emitted Type.Never()'); return 'Type.Never()' }
    if (literals.length === 1) return literals[0]
    return `Type.Union([\n${literals.map(l => innerPad + l).join(',\n')}\n${pad}]${idOpt})`
  }

  if (schema.allOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const members = schema.allOf.map(s => innerPad + toTypebox(s, context, upstreamPath, indent + 1))
    return `Type.Intersect([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  if (schema.anyOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const variantSchemas = schema.anyOf.map(branch => enrichOneOfBranch(branch, schema))
    const members = variantSchemas.map(s => innerPad + toTypebox(s, context, upstreamPath, indent + 1))
    return `Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  if (schema.oneOf) {
    const id = schema['$id']
    const idOpt = id ? `, { $id: ${JSON.stringify(id)} }` : ''
    const variantSchemas = schema.oneOf.map(branch => enrichOneOfBranch(branch, schema))
    const isPlainObjectBranch = s =>
      (s.type === 'object' || (!s.type && s.properties)) &&
      !s['$ref'] && !s.oneOf && !s.anyOf && !s.allOf && !s.enum

    if (variantSchemas.every(isPlainObjectBranch)) {
      const propKeys = s => Object.keys(s.properties || {})
      const dominated = new Set()
      for (let i = 0; i < variantSchemas.length; i++) {
        const ki = propKeys(variantSchemas[i])
        for (let j = 0; j < variantSchemas.length; j++) {
          if (i === j) continue
          const kj = propKeys(variantSchemas[j])
          if (ki.length < kj.length && ki.every(k => kj.includes(k))) dominated.add(i)
        }
      }
      if (dominated.size > 0) {
        const members = variantSchemas.map((s, i) => {
          const patched = dominated.has(i) ? { ...s, additionalProperties: false } : s
          return innerPad + toTypebox(patched, context, upstreamPath, indent + 1)
        })
        return `/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) ${[...dominated].join(',')} */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
      }
    }

    const disjointProof = proveOneOfDisjoint(variantSchemas)
    if (disjointProof) {
      const members = variantSchemas.map(s => innerPad + toTypebox(s, context, upstreamPath, indent + 1))
      return `/* oneOf->Union: exclusivity restored via disjointness proof (${disjointProof}) */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
    }

    logException('semantic-loss', context, 'oneOf mapped to Type.Union; exclusive single-match not enforced')
    const members = variantSchemas.map(s => innerPad + toTypebox(s, context, upstreamPath, indent + 1))
    return `/* oneOf->Union: exclusive constraint not enforced */ Type.Union([\n${members.join(',\n')}\n${pad}]${idOpt})`
  }

  const opts = constraintOptions(schema, context)

  if (!schema.type && (schema.properties || schema.patternProperties)) {
    return toTypebox({ ...schema, type: 'object' }, context, upstreamPath, indent)
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
      const arrOpts = {}
      if (schema.minItems !== undefined) arrOpts.minItems = schema.minItems
      if (schema.maxItems !== undefined) arrOpts.maxItems = schema.maxItems
      if (Array.isArray(schema.items)) {
        const tupleItems = schema.items.map((item, index) =>
          toTypebox(item, `${context}.items[${index}]`, upstreamPath, indent + 1))
        return `Type.Tuple([${tupleItems.join(', ')}]${Object.keys(arrOpts).length ? ', ' + JSON.stringify(arrOpts) : ''})`
      }
      const itemExpr = schema.items
        ? toTypebox(schema.items, `${context}.items`, upstreamPath, indent)
        : 'Type.Unknown()'
      return `Type.Array(${itemExpr}${Object.keys(arrOpts).length ? ', ' + JSON.stringify(arrOpts) : ''})`
    }
    case 'object': {
      if (schema.patternProperties && !schema.properties) {
        const patterns = Object.entries(schema.patternProperties)
        if (patterns.length === 1) {
          const [pat, patSchema] = patterns[0]
          const valExpr = toTypebox(patSchema, pat === '.*' ? `${context}.patternProperties.*` : `${context}.patternProperties`, upstreamPath, indent + 1)
          const keyExpr = pat === '.*'
            ? 'Type.String()'
            : `Type.String({"pattern":${JSON.stringify(pat)}})`
          return `Type.Record(${keyExpr}, ${valExpr})`
        }
        const [pat, patSchema] = patterns[0]
        const valExpr = toTypebox(patSchema, `${context}.patternProperties`, upstreamPath, indent + 1)
        logWarning(context, 'multiple patternProperties collapsed to first key pattern')
        return `Type.Record(Type.String({"pattern":${JSON.stringify(pat)}}), ${valExpr}) /* first pattern only */`
      }

      const propLines = []
      if (schema.properties) {
        const required = new Set(schema.required || [])
        const propEntries = Object.entries(schema.properties)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, propSchema]) => {
            const expr = toTypebox(propSchema, `${context}.${key}`, upstreamPath, indent + 2)
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

function emitRootModule(schema, upstreamPath) {
  const lines = []
  const schemaName = `${toPascalCase(schemaBaseName(upstreamPath))}Schema`
  const typeName = toPascalCase(schemaBaseName(upstreamPath))
  const withId = { ...schema, $id: rootId(upstreamPath) }
  const expr = toTypebox(withId, `${upstreamPath}#`, upstreamPath, 0)

  lines.push(`// Generated from SignalK specification ${UPSTREAM_REF} - do not edit manually`)
  lines.push(`// Source: ${UPSTREAM_BASE}/${upstreamPath}`)
  lines.push(`import { Type } from 'typebox'`)
  lines.push('')
  lines.push(`export const ${schemaName} = ${expr}`)
  lines.push(`export type ${typeName} = Type.Static<typeof ${schemaName}>`)
  lines.push('')

  return { schemaName, typeName, source: lines.join('\n') }
}

async function loadSchema(upstreamPath) {
  const response = await fetch(`${UPSTREAM_BASE}/${upstreamPath}`)
  if (!response.ok) throw new Error(`fetch failed for ${upstreamPath}: ${response.status}`)
  return response.json()
}

async function main() {
  const outputs = []

  for (const upstreamPath of UPSTREAM_PATHS) {
    const schema = await loadSchema(upstreamPath)
    const emitted = emitRootModule(schema, upstreamPath)
    const fileName = `${schemaBaseName(upstreamPath)}.ts`
    fs.writeFileSync(path.join(OUT_DIR, fileName), emitted.source, 'utf8')
    outputs.push({ upstreamPath, outputFile: fileName, schemaName: emitted.schemaName, typeName: emitted.typeName })
  }

  const barrel = outputs
    .map(({ outputFile, schemaName, typeName }) =>
      `export { ${schemaName} } from './${outputFile.replace('.ts', '.js')}'\nexport type { ${typeName} } from './${outputFile.replace('.ts', '.js')}'`)
    .join('\n\n') + '\n'
  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), barrel, 'utf8')

  const manifest = {
    phase: 'Phase 3',
    batch: 'Batch 7',
    scope: 'sails-performance',
    generatedAt: new Date().toISOString(),
    upstreamRef: UPSTREAM_REF,
    upstreamPaths: UPSTREAM_PATHS,
    outputs,
    exceptions: EXCEPTIONS,
    warnings: WARNINGS,
    externalRefAllowlist: Array.from(EXTERNAL_REF_ALLOWLIST),
    formatMappingsApplied: FORMAT_TRACE.applied,
    unmappedFormatCandidates: FORMAT_TRACE.unmapped
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`Wrote ${outputs.length} sails/performance schema module(s) to ${OUT_DIR}`)
  console.log(`Exceptions: ${EXCEPTIONS.length}, Warnings: ${WARNINGS.length}`)
  console.log(`Unmapped format candidates: ${FORMAT_TRACE.unmapped.length}`)
  console.log(`Format mappings applied: ${FORMAT_TRACE.applied.length}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
