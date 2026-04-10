// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/environment.json
import { Type } from 'typebox'

export const EnvironmentSchema = Type.Object({
    "current": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Object({
              "drift": Type.Optional(Type.Number({"description":"The speed component of the water current vector","examples":[3.12]})),
              "setMagnetic": Type.Optional(Type.Number({"description":"The direction component of the water current vector referenced to magnetic north","examples":[131.22]})),
              "setTrue": Type.Optional(Type.Number({"description":"The direction component of the water current vector referenced to true (geographic) north","examples":[123.45]}))
            })),
          "values": Type.Optional(Type.Record(Type.String(), Type.Object({
                "pgn": Type.Optional(Type.Number()),
                "sentence": Type.Optional(Type.String()),
                "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
                "value": Type.Optional(Type.Object({
                    "drift": Type.Optional(Type.Number({"description":"The speed component of the water current vector","examples":[3.12]})),
                    "setMagnetic": Type.Optional(Type.Number({"description":"The direction component of the water current vector referenced to magnetic north","examples":[131.22]})),
                    "setTrue": Type.Optional(Type.Number({"description":"The direction component of the water current vector referenced to true (geographic) north","examples":[123.45]}))
                  }))
              })))
        })
    ])),
    "depth": Type.Optional(Type.Object({
        "belowKeel": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "belowSurface": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "belowTransducer": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "surfaceToTransducer": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "transducerToKeel": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Depth related data","title":"depth"})),
    "heave": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "inside": Type.Optional(Type.Intersect([
      Type.Record(Type.String({"pattern":"[A-Za-z0-9]+"}), Type.Ref("signalk://schemas/groups/environment#ZoneObject")),
      Type.Ref("signalk://schemas/groups/environment#ZoneObject")
    ])),
    "mode": Type.Optional(Type.Object({
        "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
        "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
        "value": Type.Optional(Type.Union([
          Type.Literal("day"),
          Type.Literal("night"),
          Type.Literal("restricted visibility")
        ]))
      }, {"description":"Mode of the vessel based on the current conditions. Can be combined with navigation.state to control vessel signals eg switch to night mode for instrumentation and lights, or make sound signals for fog."})),
    "outside": Type.Optional(Type.Object({
        "airDensity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "apparentWindChillTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "dewPointTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "heatIndexTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "humidity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "illuminance": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "pressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "relativeHumidity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "temperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "theoreticalWindChillTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Environmental conditions outside of the vessel's hull"})),
    "tide": Type.Optional(Type.Object({
        "heightHigh": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "heightLow": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "heightNow": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "timeHigh": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
        "timeLow": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
      }, {"description":"Tide data","title":"tide"})),
    "time": Type.Optional(Type.Object({
        "millis": Type.Optional(Type.Number({"description":"Milliseconds since the UNIX epoch (1970-01-01 00:00:00)","title":"Epoch time","examples":[1449648657735]})),
        "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
        "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
        "timezoneOffset": Type.Optional(Type.Number({"minimum":-1300,"maximum":1300,"description":"Onboard timezone offset from UTC in hours and minutes (-)hhmm. +ve means east of Greenwich. For use by UIs","title":"Timezone offset","default":0,"examples":[-400]})),
        "timezoneRegion": Type.Optional(Type.String({"pattern":"^[a-zA-Z0-9/+-]+$","description":"Onboard timezone offset as listed in the IANA timezone database (tz database)","title":"IANA Timezone national region","examples":["Europe/Zurich"]}))
      }, {"description":"A time reference for the vessel. All clocks on the vessel dispaying local time should use the timezone offset here. If a timezoneRegion is supplied the timezone must also be supplied. If timezoneRegion is supplied that should be displayed by UIs in preference to simply timezone. ie 12:05 (Europe/London) should be displayed in preference to 12:05 (UTC+01:00)"})),
    "water": Type.Optional(Type.Object({
        "salinity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "temperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Environmental conditions of the water that the vessel is sailing in"})),
    "wind": Type.Optional(Type.Object({
        "angleApparent": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "angleTrueGround": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "angleTrueWater": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "directionChangeAlarm": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "directionMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "directionTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "speedApparent": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "speedOverGround": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "speedTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Wind data.","title":"wind"}))
  }, {"$id":"signalk://schemas/groups/environment","description":"Schema describing the environmental child-object of a Vessel.","title":"environment"})
export type Environment = Type.Static<typeof EnvironmentSchema>
