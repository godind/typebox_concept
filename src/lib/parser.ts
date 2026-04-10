/**
 * Purpose: Convert Signal K deltas into accepted values with optional
 * schema-based validation, driven by meta.type path mappings.
 * Guidance: Preserve fail-open behavior for unknown schema names and keep path
 * as the canonical schema key across contexts unless product rules change.
 */
import { asSkMetaArray, asSkUpdateArray, asSkValueArray, isObject, type SkDelta } from './types.js'
import { createSchemaValidators, type KnownSchemaValidators } from './validators.js'
import { KnownSchemaRegistry, type SignalKSchemaName, type KnownSchemaTypeMap, type NormalizedBaseDelta } from './schemas.js'

/** Indicates whether and how a path's Signal K schema type was resolved from the meta index. */
export type SchemaTypeStatus = 'no-schema-type' | 'unknown-schema-type' | 'known-schema-type'

/** Overall outcome of schema validation for a parsed value. */
export type ValidationStatus = 'not-validated' | 'valid' | 'invalid'

/** A structured TypeBox error entry from a failed schema validation. */
export type ValidationError = ReturnType<KnownSchemaValidators[SignalKSchemaName]['Errors']> extends Iterable<infer T>
  ? T
  : never

/** Value that passed schema validation; `value` is typed to the resolved schema. */
export type ValidatedValue = {
  [K in SignalKSchemaName]: KnownSchemaTypeMap[K] & {
    schemaName: K
    valueType: K
    schemaTypeStatus: 'known-schema-type'
    validationStatus: 'valid'
  }
}[SignalKSchemaName]

/** Value that failed schema validation; `value` is preserved and `validationErrors` holds structured TypeBox errors. */
export type InvalidValue = NormalizedBaseDelta & {
  value: unknown
  schemaName: SignalKSchemaName
  valueType: SignalKSchemaName
  schemaTypeStatus: 'known-schema-type'
  validationStatus: 'invalid'
  validationErrors: ValidationError[]
}

/** Value whose path has no schema type recorded in the meta index; passes through unvalidated. */
export type NoSchemaTypeValue = NormalizedBaseDelta & {
  value: unknown
  schemaName?: undefined
  valueType?: undefined
  schemaTypeStatus: 'no-schema-type'
  validationStatus: 'not-validated'
}

/** Value whose path has a schema type string in the meta index that does not match any registered known schema. */
export type UnknownSchemaTypeValue = NormalizedBaseDelta & {
  value: unknown
  schemaName?: undefined
  valueType: string
  schemaTypeStatus: 'unknown-schema-type'
  validationStatus: 'not-validated'
}

/** Discriminated union of all possible outcomes for a single parsed Signal K value entry. Narrow by `validationStatus` then `schemaTypeStatus`. */
export type ParsedValue = ValidatedValue | InvalidValue | NoSchemaTypeValue | UnknownSchemaTypeValue

class SchemaTypeIndex {
  private readonly pathToMetaType = new Map<string, string>()

  index(delta: SkDelta): void {
    for (const update of asSkUpdateArray(delta.updates)) {
      if (!isObject(update)) continue

      for (const meta of asSkMetaArray(update.meta)) {
        if (!isObject(meta)) continue

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

  lookupValueType(path: string): string | undefined {
    return this.pathToMetaType.get(path)
  }

  lookupSchemaName(path: string): SignalKSchemaName | undefined {
    const raw = this.lookupValueType(path)
    if (!raw) return undefined
    if (raw in KnownSchemaRegistry) return raw as SignalKSchemaName
    return undefined
  }
}

export type SchemaTypeIndexView = Pick<SchemaTypeIndex, 'index' | 'lookupValueType' | 'lookupSchemaName'>

// Test-facing constructor for exercising index lookup behavior directly.
export function createSchemaTypeIndex(): SchemaTypeIndexView {
  return new SchemaTypeIndex()
}

function process(
  delta: SkDelta,
  map: SchemaTypeIndex,
  validators: KnownSchemaValidators
): ParsedValue[] {
  const accepted: ParsedValue[] = []
  const context = typeof delta.context === 'string' ? delta.context : 'vessels.self'

  for (const update of asSkUpdateArray(delta.updates)) {
    if (!isObject(update)) continue

    const timestamp = typeof update.timestamp === 'string' ? update.timestamp : undefined
    const sourceRef = typeof update.$source === 'string' ? update.$source : 'unknown-source'

    for (const valueEntry of asSkValueArray(update.values)) {
      if (!isObject(valueEntry)) continue

      if (typeof valueEntry.path !== 'string') continue
      const path = valueEntry.path
      const base: NormalizedBaseDelta = {
        context,
        $source: sourceRef,
        source: update.source,
        path,
        ...(timestamp ? { timestamp } : {})
      }

      const valueType = map.lookupValueType(path)
      if (!valueType) {
        accepted.push({
          ...base,
          value: valueEntry.value,
          schemaTypeStatus: 'no-schema-type',
          validationStatus: 'not-validated'
        })
        continue
      }

      const schemaName = map.lookupSchemaName(path)
      if (!schemaName) {
        accepted.push({
          ...base,
          value: valueEntry.value,
          valueType,
          schemaTypeStatus: 'unknown-schema-type',
          validationStatus: 'not-validated'
        })
        continue
      }

      const validator = validators[schemaName]
      const candidate = { ...base, value: valueEntry.value }
      if (validator.Check(candidate)) {
        accepted.push({
          ...candidate,
          valueType: schemaName,
          schemaTypeStatus: 'known-schema-type',
          schemaName,
          validationStatus: 'valid'
        } as ValidatedValue)
      } else {
        const validationErrors = [...validator.Errors(candidate)]
        accepted.push({
          ...base,
          value: valueEntry.value,
          schemaName,
          valueType: schemaName,
          schemaTypeStatus: 'known-schema-type',
          validationStatus: 'invalid',
          validationErrors
        })
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
  validateValues: (delta: SkDelta) => ParsedValue[]

  /**
   * One-step pipeline: index schema types from delta metadata, then validate values shape and content.
   */
  processValues: (delta: SkDelta) => ParsedValue[]
}

/**
 * Create a Signal K parser runtime that validates messages against
 * predefined schemas using an internal path-to-schema-type index.
 */
export function createParserRuntime(validators: KnownSchemaValidators = createSchemaValidators()): ParserRuntime {
  const schemaTypeIndex = new SchemaTypeIndex()

  return {
    indexSchemaTypes(delta: SkDelta): void {
      schemaTypeIndex.index(delta)
    },
    validateValues(delta: SkDelta): ParsedValue[] {
      return process(delta, schemaTypeIndex, validators)
    },
    processValues(delta: SkDelta): ParsedValue[] {
      schemaTypeIndex.index(delta)
      return process(delta, schemaTypeIndex, validators)
    }
  }
}
