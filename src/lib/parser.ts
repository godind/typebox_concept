/**
 * Purpose: Convert Signal K deltas into accepted values with optional
 * schema-based validation, driven by meta.type path mappings.
 * Guidance: Preserve fail-open behavior for unknown schema names and keep path
 * as the canonical schema key across contexts unless product rules change.
 */
import { asSkMetaArray, asSkUpdateArray, asSkValueArray, isObject, type SkDelta } from './types.js'
import type { KnownSchemaValidators } from './validators.js'
import {
  KnownSchemaRegistry,
  type KnownSchemaName,
  type KnownSchemaTypeMap,
  type NormalizedBaseDelta
} from './schemas.js'

export type ValidationStatus = 'validated' | 'accepted-unvalidated'

export type KnownValidatedDelta = {
  [K in KnownSchemaName]: KnownSchemaTypeMap[K] & {
    schemaName: K
    validationStatus: 'validated'
  }
}[KnownSchemaName]

export type UnvalidatedDelta = NormalizedBaseDelta & {
  value: unknown
  schemaName?: undefined
  validationStatus: 'accepted-unvalidated'
}

export type AcceptedDeltaValue = KnownValidatedDelta | UnvalidatedDelta

export class MetaTypeMap {
  private readonly pathToMetaType = new Map<string, string>()

  ingest(delta: SkDelta): void {
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

  getSchemaName(path: string): KnownSchemaName | undefined {
    const raw = this.pathToMetaType.get(path)
    if (!raw) return undefined
    if (raw in KnownSchemaRegistry) return raw as KnownSchemaName
    return undefined
  }
}

export function toAcceptedDeltaValues(
  delta: SkDelta,
  map: MetaTypeMap,
  validators: KnownSchemaValidators
): AcceptedDeltaValue[] {
  const accepted: AcceptedDeltaValue[] = []
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

      const schemaName = map.getSchemaName(path)
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
        } as KnownValidatedDelta)
      }
    }
  }

  return accepted
}
