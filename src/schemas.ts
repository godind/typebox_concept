import { Type, type Static, type TSchema } from '@sinclair/typebox'
import type { Context, Path, SourceRef, Timestamp } from './types.js'

export const PositionSchema = Type.Object({
    latitude: Type.Number(),
    longitude: Type.Number(),
    altitude: Type.Optional(Type.Number())
})
export const NormalizedBaseDeltaSchema = Type.Object({
    context: Type.Unsafe<Context>(Type.String()),
    $source: Type.Unsafe<SourceRef>(Type.String()),
    source: Type.Optional(Type.Unknown()),
    path: Type.Unsafe<Path>(Type.String()),
    timestamp: Type.Optional(Type.Unsafe<Timestamp>(Type.String()))
})
export type NormalizedBaseDelta = Static<typeof NormalizedBaseDeltaSchema>
export const NumericDeltaValueSchema = Type.Intersect([
    NormalizedBaseDeltaSchema,
    Type.Object({
        value: Type.Union([Type.Number(), Type.Null()])
    })
])
export type NumericDeltaValue = Static<typeof NumericDeltaValueSchema>
export const PositionDeltaValueSchema = Type.Intersect([
    NormalizedBaseDeltaSchema,
    Type.Object({
        value: Type.Union([PositionSchema, Type.Null()])
    })
])

export type Position = Static<typeof PositionDeltaValueSchema>
export const KnownSchemaRegistry = {
    NumericDeltaValue: NumericDeltaValueSchema,
    Position: PositionDeltaValueSchema
} as const satisfies Record<string, TSchema>
export type KnownSchemaName = keyof typeof KnownSchemaRegistry
export type KnownSchemaTypeMap = {
    NumericDeltaValue: NumericDeltaValue
    Position: Position
}
