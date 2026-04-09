/**
 * Purpose: Convert Signal K deltas into accepted values with optional
 * schema-based validation, driven by meta.type path mappings.
 * Guidance: Preserve fail-open behavior for unknown schema names and keep path
 * as the canonical schema key across contexts unless product rules change.
 */
import { asSkMetaArray, asSkUpdateArray, asSkValueArray, isObject, type SkDelta } from './types.js'
import { createDeltaValidators, type KnownSchemaValidators } from './validators.js'
import { KnownSchemaRegistry, type SignalKSchemaName, type KnownSchemaTypeMap, type NormalizedBaseDelta } from './schemas.js'

export type ValidationStatus = 'validated' | 'accepted-unvalidated'

export type ValidatedDeltaValue = {
  [K in SignalKSchemaName]: KnownSchemaTypeMap[K] & {
    schemaName: K
    validationStatus: 'validated'
  }
}[SignalKSchemaName]

export type UnvalidatedDeltaValue = NormalizedBaseDelta & {
  value: unknown
  schemaName?: undefined
  validationStatus: 'accepted-unvalidated'
}

export type ParsedDeltaValue = ValidatedDeltaValue | UnvalidatedDeltaValue

class SchemaTypeIndex {
  private readonly pathToMetaType = new Map<string, string>()

  index(delta: SkDelta): void {
    for (const update of asSkUpdateArray(delta.updates)) {
      for (const meta of asSkMetaArray(update.meta)) {
        const path = typeof meta.path === 'string' ? meta.path : null
        const typeName =
          isObject(meta.value) && typeof meta.value.type === 'string'
            ? meta.value.type
            : null
        if (!path || !typeName) continue
        this.pathToMetaType.set(path, typeName)
      }
    }
  }

  lookupSchemaName(path: string): SignalKSchemaName | undefined {
    const raw = this.pathToMetaType.get(path)
    if (!raw) return undefined
    if (raw in KnownSchemaRegistry) return raw as SignalKSchemaName
    return undefined
  }
}

function process(
  delta: SkDelta,
  map: SchemaTypeIndex,
  validators: KnownSchemaValidators
): ParsedDeltaValue[] {
  const accepted: ParsedDeltaValue[] = []
  const context = typeof delta.context === 'string' ? delta.context : 'vessels.self'

  for (const update of asSkUpdateArray(delta.updates)) {
    const timestamp = typeof update.timestamp === 'string' ? update.timestamp : undefined
    const sourceRef = typeof update.$source === 'string' ? update.$source : 'unknown-source'

    for (const valueEntry of asSkValueArray(update.values)) {
      if (typeof valueEntry.path !== 'string') continue
      const path = valueEntry.path
      const base: NormalizedBaseDelta = {
        context,
        $source: sourceRef,
        source: update.source,
        path,
        ...(timestamp ? { timestamp } : {})
      }

      const schemaName = map.lookupSchemaName(path)
      if (!schemaName) {
        accepted.push({
          ...base,
          value: valueEntry.value,
          validationStatus: 'accepted-unvalidated'
        })
        continue
      }

      const validator = validators[schemaName]
      const candidate = { ...base, value: valueEntry.value }
      if (validator.Check(candidate)) {
        accepted.push({
          ...candidate,
          schemaName,
          validationStatus: 'validated'
        } as ValidatedDeltaValue)
      }
    }
  }

  return accepted
}

export type ParserRuntime = {
  /**
   * Update internal path -> schema-type mappings from meta.type entries in a delta.
   * Call this when you want explicit control over indexing and validation order.
   */
  indexSchemaTypes: (delta: SkDelta) => void

  /**
   * Validate values shape and content against the current schema index
   * without indexing new metadata meta.type entries from the same delta.
   * Call this when you want to preserve existing schema-type mappings and
   * only validate against previously indexed types.
   * 
   * Useful in staged flows where metadata indexing is handled separately.
   */
  validateDeltaValues: (delta: SkDelta) => ParsedDeltaValue[]

  /**
   * One-step pipeline: index schema types from delta metadata, then validate values shape and content.
   */
  processDelta: (delta: SkDelta) => ParsedDeltaValue[]
}

/**
 * Create a Signal K parser runtime that validates messages against
 * predefined schemas using an internal path-to-schema-type index.
 */
export function createParserRuntime(validators: KnownSchemaValidators = createDeltaValidators()): ParserRuntime {
  const schemaTypeIndex = new SchemaTypeIndex()

  return {
    indexSchemaTypes(delta: SkDelta): void {
      schemaTypeIndex.index(delta)
    },
    validateDeltaValues(delta: SkDelta): ParsedDeltaValue[] {
      return process(delta, schemaTypeIndex, validators)
    },
    processDelta(delta: SkDelta): ParsedDeltaValue[] {
      schemaTypeIndex.index(delta)
      return process(delta, schemaTypeIndex, validators)
    }
  }
}
