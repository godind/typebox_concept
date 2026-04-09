/**
 * Purpose: Compile and expose runtime validators for all known schemas.
 * Guidance: Keep compilation centralized and one-time so callers reuse
 * compiled validators instead of recompiling in hot paths.
 */
import { Compile } from 'typebox/schema'
import { KnownSchemaRegistry, type SignalKSchemaName } from './schemas.js'
import { registerRuntimeFormats } from './formaters.js'

export type KnownSchemaValidators = Record<SignalKSchemaName, ReturnType<typeof Compile>>

// Compile all known schemas once so parser logic can consume ready-to-use
// validators without rebuilding them for each incoming delta message.
export function createSchemaValidators(): KnownSchemaValidators {
  registerRuntimeFormats()
  const compiled = {} as KnownSchemaValidators
  for (const schemaName of Object.keys(KnownSchemaRegistry) as SignalKSchemaName[]) {
      compiled[schemaName] = Compile(KnownSchemaRegistry[schemaName])
  }
  return compiled
}
