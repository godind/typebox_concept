export type Context = string
export type Path = string
export type SourceRef = string
export type Timestamp = string

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
