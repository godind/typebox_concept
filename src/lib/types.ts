/**
 * Purpose: Provide lightweight transport-layer types and narrowing helpers.
 * Guidance: Keep this file tolerant of partial or malformed inbound payloads;
 * strict contract validation belongs in TypeBox schemas.
 *
 * Why fail-open at this boundary:
 * - Websocket frames can be mixed (hello/discovery/delta), partial, or malformed.
 * - Parser runtime should keep processing usable entries instead of rejecting
 *   the whole frame on first shape mismatch.
 * - Schema validation is applied later, per value, once path -> schema-type is
 *   resolved. This preserves observability and supports incremental recovery.
 *
 * This file is intentionally permissive input normalization, not contract
 * enforcement. Contract enforcement remains in compiled TypeBox validators.
 */
import type {
  SourceRef as SignalKSourceRef,
  Timestamp as SignalKTimestamp
} from './schemas/foundation/foundation-definitions.js'

export type Context = string
export type Path = string
export type SourceRef = SignalKSourceRef
export type Timestamp = SignalKTimestamp

export interface SkMetaEntry {
  path?: unknown
  value?: {
    type?: unknown
  }
}

export interface SkValueEntry {
  path?: unknown
  value?: unknown
}

export interface SkUpdate {
  timestamp?: unknown
  $source?: unknown
  source?: unknown
  values?: unknown
  meta?: unknown
}

export interface SkDelta {
  context?: unknown
  updates?: unknown
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

export const asSkUpdateArray = (v: unknown): SkUpdate[] =>
  Array.isArray(v) ? (v as SkUpdate[]) : []

export const asSkValueArray = (v: unknown): SkValueEntry[] =>
  Array.isArray(v) ? (v as SkValueEntry[]) : []

export const asSkMetaArray = (v: unknown): SkMetaEntry[] =>
  Array.isArray(v) ? (v as SkMetaEntry[]) : []
