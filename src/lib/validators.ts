/**
 * Purpose: Compile and expose runtime validators for all known schemas.
 * Guidance: Keep compilation centralized and one-time so callers reuse
 * compiled validators instead of recompiling in hot paths.
 */
import { Compile } from 'typebox/schema'
import { KnownSchemaRegistry, type KnownSchemaName } from './schemas.js'

export type KnownSchemaValidators = Record<KnownSchemaName, ReturnType<typeof Compile>>

// Compile all known schemas once so parser logic can consume ready-to-use
// validators without rebuilding them for each incoming delta message.
export function createDeltaValidators(): KnownSchemaValidators {
  const compiled = {} as KnownSchemaValidators
  for (const schemaName of Object.keys(KnownSchemaRegistry) as KnownSchemaName[]) {
      compiled[schemaName] = Compile(KnownSchemaRegistry[schemaName])
  }
  return compiled
}
