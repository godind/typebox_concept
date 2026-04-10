// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/performance.json
import { Type } from 'typebox'

export const PerformanceSchema = Type.Object({
    "activePolar": Type.Optional(Type.String({"description":"The UUID of the active polar table"})),
    "activePolarData": Type.Optional(Type.Ref("signalk://schemas/groups/performance#Polar")),
    "beatAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "beatAngleTargetSpeed": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "beatAngleVelocityMadeGood": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "gybeAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "gybeAngleTargetSpeed": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "gybeAngleVelocityMadeGood": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "leeway": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "polars": Type.Optional(Type.Ref("signalk://schemas/groups/performance#PolarUuid")),
    "polarSpeed": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "polarSpeedRatio": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "tackMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "tackTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "targetAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "targetSpeed": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "velocityMadeGood": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "velocityMadeGoodToWaypoint": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
  }, {"$id":"signalk://schemas/groups/performance","description":"Schema describing the performance child-object of a Vessel.","title":"performance"})
export type Performance = Type.Static<typeof PerformanceSchema>
export const PolarSchema = Type.Object({
    "description": Type.Optional(Type.String()),
    "id": Type.String(),
    "name": Type.String(),
    "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
    "windData": Type.Array(Type.Object({
        "angleData": Type.Array(Type.Tuple([Type.Number({"description":"The true wind angle for the best upwind velocity made good"}), Type.Number({"description":"The optimal beating speed"}), Type.Number({"description":"Velocity made good calculated for the wind angle and boat speed combination"})], {"minItems":2,"maxItems":3})),
        "optimalBeats": Type.Optional(Type.Array(Type.Tuple([Type.Number({"description":"The true wind angle for the best upwind velocity made good"}), Type.Number({"description":"The optimal beating speed"})], {"minItems":2,"maxItems":2}), {"maxItems":2})),
        "optimalGybes": Type.Optional(Type.Array(Type.Tuple([Type.Number({"description":"The true wind angle for the best downwind velocity made good"}), Type.Number({"description":"The optimal gybe speed"})], {"minItems":2,"maxItems":2}), {"maxItems":2})),
        "trueWindSpeed": Type.Number({"description":"The true wind speed for the polar values"})
      }, {"additionalProperties":false}))
  }, {"$id":"signalk://schemas/groups/performance#Polar","title":"polar","additionalProperties":false})
export type Polar = Type.Static<typeof PolarSchema>
export const PolarUuidSchema = Type.Record(Type.String({"pattern":"^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"}), Type.Ref("signalk://schemas/groups/performance#Polar"))
export type PolarUuid = Type.Static<typeof PolarUuidSchema>
