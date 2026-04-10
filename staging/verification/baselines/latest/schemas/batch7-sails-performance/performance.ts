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
