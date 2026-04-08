/**
 * Purpose: Public library barrel for published APIs.
 * Guidance: Re-export stable modules only. Keep smoke-test runtime modules out
 * of this file to avoid expanding the supported package surface.
 */
export {
    PositionSchema,
    NumericDeltaValueSchema,
    PositionDeltaValueSchema,
    type Numeric,
    type Position,
    type KnownSchemaName
} from './schemas.js'

export { createDeltaValidators } from './validators.js'

export {
    createParserRuntime,
    type ParserRuntime,
    type ValidationStatus,
    type AcceptedDeltaValue,
    type KnownValidatedDelta,
    type UnvalidatedDelta
} from './parser.js'
