/**
 * Purpose: Registry of known Signal K schema types used by the parser.
 * Sources typed from auto-generated Signal K specification definitions,
 * but uses locally-compiled validation schemas to avoid Type.Ref() resolution issues.
 * Guidance: Do not edit manually. Keep in sync with generated definitions.
 */
 import { Type, type TSchema } from 'typebox'
 
 // Construct basic TypeBox schema for normalized delta structure
 export const NormalizedBaseDeltaSchema = Type.Object({
     context: Type.String(),
     $source: Type.String(),
     source: Type.Optional(Type.Unknown()),
     path: Type.String(),
     timestamp: Type.Optional(Type.String())
 })
 
 /** Normalized delta entry with required infrastructure fields (context, source, path, timestamp). */
 export type NormalizedBaseDelta = Type.Static<typeof NormalizedBaseDeltaSchema>
 
 // Wrapper schemas for runtime validation: inline structure to avoid Type.Ref() resolution issues
 // These validate the position value object structure
 const PositionValueSchema = Type.Object({
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
 
 // Validates a Single numeric or Position value in a delta
 const NumericDeltaSchema = Type.Intersect([
     NormalizedBaseDeltaSchema,
     Type.Object({
         value: Type.Union([Type.Number(), Type.Null()])
     })
 ])
 
 const PositionDeltaSchema = Type.Intersect([
     NormalizedBaseDeltaSchema,
     Type.Object({
         value: Type.Union([PositionValueSchema, Type.Null()])
     })
 ])
 
 // Single source of truth for known delta-value schemas.
 // Each entry maps a schema name to its validation schema.
 const DeclaredKnownDeltaValueSchemas = {
     Numeric: NumericDeltaSchema,
     Position: PositionDeltaSchema
 } as const satisfies Record<string, TSchema>

// Registry is derived from the declared schema source so we cannot forget to sync it.
export const KnownSchemaRegistry = DeclaredKnownDeltaValueSchemas

export type SignalKSchemaName = keyof typeof KnownSchemaRegistry

// Auto-derive schema-name -> static type from the registry so adding a new
// known schema updates parser/router typing without extra manual mapping.
export type KnownSchemaTypeMap = {
    [K in SignalKSchemaName]: Type.Static<(typeof KnownSchemaRegistry)[K]>
}
