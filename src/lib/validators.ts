/**
 * Purpose: Compile and expose runtime validators for all known schemas.
 * Guidance: Keep compilation centralized and one-time so callers reuse
 * compiled validators instead of recompiling in hot paths.
 */
import { Compile } from 'typebox/schema'
import { KnownSchemaRegistry, type SignalKSchemaName } from './schemas.js'
import { registerRuntimeFormats } from './formats.js'

export type KnownSchemaValidators = Record<SignalKSchemaName, ReturnType<typeof Compile>>

/**
 * Compile all known Signal K schemas once into reusable runtime validators.
 * Pass the result to `createParserRuntime()` to avoid recompiling on every call.
 */
export function createSchemaValidators(): KnownSchemaValidators {
  registerRuntimeFormats()
  const compiled = {} as KnownSchemaValidators
  for (const schemaName of Object.keys(KnownSchemaRegistry) as SignalKSchemaName[]) {
      compiled[schemaName] = Compile(KnownSchemaRegistry[schemaName])
  }
  return compiled
}
