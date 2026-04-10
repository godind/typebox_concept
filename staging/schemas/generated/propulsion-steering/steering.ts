// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/steering.json
import { Type } from 'typebox'

export const SteeringSchema = Type.Object({
    "autopilot": Type.Optional(Type.Object({
        "backlash": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "deadZone": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "gain": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "maxDriveCurrent": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "maxDriveRate": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "mode": Type.Optional(Type.Intersect([
          Type.Ref("signalk://schemas/definitions#CommonValueFields"),
          Type.Object({
              "value": Type.Optional(Type.Union([
                Type.Literal("powersave"),
                Type.Literal("normal"),
                Type.Literal("accurate")
              ]))
            })
        ])),
        "portLock": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "starboardLock": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "state": Type.Optional(Type.Intersect([
          Type.Ref("signalk://schemas/definitions#CommonValueFields"),
          Type.Object({
              "value": Type.Optional(Type.Union([
                Type.Literal("auto"),
                Type.Literal("standby"),
                Type.Literal("alarm"),
                Type.Literal("noDrift"),
                Type.Literal("wind"),
                Type.Literal("depthContour"),
                Type.Literal("route"),
                Type.Literal("directControl")
              ]))
            })
        ])),
        "target": Type.Optional(Type.Object({
            "headingMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
            "headingTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
            "windAngleApparent": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
            "windAngleTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
          }, {"description":"Autopilot target","title":"target"}))
      }, {"description":"Autopilot data","title":"autopilot"})),
    "rudderAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "rudderAngleTarget": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
  }, {"$id":"signalk://schemas/groups/steering","description":"Schema describing the steering child-object of a vessel.","title":"steering"})
export type Steering = Type.Static<typeof SteeringSchema>
