/**
 * Purpose: Define Signal K TypeBox runtime schemas and derive static TS types.
 * Guidance: Add new validated delta shapes here first, then rely on the
 * registry/type-map auto-derivation for parser and validator wiring.
 */
import { Type, type TSchema } from 'typebox'

// Construct basic TypeBox schemas
export const NormalizedBaseDeltaSchema = Type.Object({
    context: Type.String(),
    $source: Type.String(),
    source: Type.Optional(Type.Unknown()),
    path: Type.String(),
    timestamp: Type.Optional(Type.String())
})

const PositionValueSchema = Type.Object({
    latitude: Type.Number({
        minimum: -90,
        maximum: 90
    }),
    longitude: Type.Number({
        minimum: -20,
        maximum: 180
    }),
    altitude: Type.Optional(Type.Number({
        minimum: -11000,
        maximum: 100000
    }))
}, {
    additionalProperties: false
})

export const PositionSchema = Type.Union([PositionValueSchema, Type.Null()])

export const NumericSchema = Type.Union([Type.Number(), Type.Null()])

// Single source of truth for known delta-value schemas.
// Add new known schemas here and the registry/type-map update automatically.
const DeclaredKnownDeltaValueSchemas = {
    Numeric: Type.Intersect([
        NormalizedBaseDeltaSchema,
        Type.Object({
            value: NumericSchema
        })
    ]),
    Position: Type.Intersect([
        NormalizedBaseDeltaSchema,
        Type.Object({
            value: PositionSchema
        })
    ])
} as const satisfies Record<string, TSchema>

// Keep explicit exports for readability and direct imports at call sites.
export const NumericDeltaValueSchema = DeclaredKnownDeltaValueSchemas.Numeric
export const PositionDeltaValueSchema = DeclaredKnownDeltaValueSchemas.Position

// Export TS types directly from TypeBox schemas for
// zero-drift safety in parser/router
export type NormalizedBaseDelta = Type.Static<typeof NormalizedBaseDeltaSchema>
export type Numeric = Type.Static<typeof NumericSchema>
export type Position = Type.Static<typeof PositionSchema>

// Registry is derived from the declared schema source so we cannot forget to sync it.
export const KnownSchemaRegistry = DeclaredKnownDeltaValueSchemas

export type SignalKSchemaName = keyof typeof KnownSchemaRegistry

// Auto-derive schema-name -> static type from the registry so adding a new
// known schema updates parser/router typing without extra manual mapping.
export type KnownSchemaTypeMap = {
    [K in SignalKSchemaName]: Type.Static<(typeof KnownSchemaRegistry)[K]>
}
