import { Type, type TSchema } from '@sinclair/typebox'

// Construct basic TypeBox schemas
export const NormalizedBaseDeltaSchema = Type.Object({
    context: Type.String(),
    $source: Type.String(),
    source: Type.Optional(Type.Unknown()),
    path: Type.String(),
    timestamp: Type.Optional(Type.String())
})

export const PositionSchema = Type.Object({
    latitude: Type.Number({
        minimum: -90,
        maximum: 90
    }),
    longitude: Type.Number({
        minimum: -180,
        maximum: 180
    }),
    altitude: Type.Optional(Type.Number({
        minimum: -11000,
        maximum: 100000
    }))
}, {
    additionalProperties: false
})

// Single source of truth for known delta-value schemas.
// Add new known schemas here and the registry/type-map update automatically.
const DeclaredKnownDeltaValueSchemas = {
    Numeric: Type.Intersect([
        NormalizedBaseDeltaSchema,
        Type.Object({
            value: Type.Union([Type.Number(), Type.Null()])
        })
    ]),
    Position: Type.Intersect([
        NormalizedBaseDeltaSchema,
        Type.Object({
            value: Type.Union([PositionSchema, Type.Null()])
        })
    ])
} as const satisfies Record<string, TSchema>

// Keep explicit exports for readability and direct imports at call sites.
export const NumericDeltaValueSchema = DeclaredKnownDeltaValueSchemas.Numeric
export const PositionDeltaValueSchema = DeclaredKnownDeltaValueSchemas.Position

// Export TS types directly from TypeBox schemas for
// zero-drift safety in parser/router
export type NormalizedBaseDelta = typeof NormalizedBaseDeltaSchema.static
export type Numeric = typeof NumericDeltaValueSchema.static
export type Position = typeof PositionDeltaValueSchema.static

// Registry is derived from the declared schema source so we cannot forget to sync it.
export const KnownSchemaRegistry = DeclaredKnownDeltaValueSchemas

export type KnownSchemaName = keyof typeof KnownSchemaRegistry

// Auto-derive schema-name -> static type from the registry so adding a new
// known schema updates parser/router typing without extra manual mapping.
export type KnownSchemaTypeMap = {
    [K in KnownSchemaName]: (typeof KnownSchemaRegistry)[K]['static']
}
