/**
 * Purpose: Public library barrel for published APIs.
 * Guidance: Re-export stable modules only. Keep smoke-test runtime modules out
 * of this file to avoid expanding the supported package surface.
 */
export { createSchemaValidators } from './validators.js'

export {
    createParserRuntime,
    type ParserRuntime,
    type SchemaTypeStatus,
    type ValidationStatus,
    type ParsedValue,
    type ValidatedValue,
    type InvalidValue,
    type NoSchemaTypeValue,
    type UnknownSchemaTypeValue
} from './parser.js'

/**
 * Facade re-exports: grouped API surfaces organized by semantic domain.
 * Users can import directly from these facades: import { ... } from '@/lib/facades/transport'
 * Or import from the unified barrel: import { ... } from '@/lib'
 */
export * from './facades/index.js'
