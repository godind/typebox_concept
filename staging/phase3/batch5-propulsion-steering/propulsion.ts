// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/propulsion.json
import { Type } from 'typebox'

export const PropulsionSchema = Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Object({
      "alternatorVoltage": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "boostPressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "coolantPressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "coolantTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "drive": Type.Optional(Type.Object({
          "propeller": Type.Optional(Type.Unknown()),
          "thrustAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "trimState": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "type": Type.Optional(Type.Union([
            Type.Literal("saildrive"),
            Type.Literal("shaft"),
            Type.Literal("outboard"),
            Type.Literal("jet"),
            Type.Literal("pod"),
            Type.Literal("other")
          ]))
        }, {"description":"Data about the engine's drive."})),
      "engineLoad": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "engineTorque": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "exhaustTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "fuel": Type.Optional(Type.Object({
          "averageRate": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "economyRate": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "pressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "rate": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "type": Type.Optional(Type.Union([
            Type.Literal("diesel"),
            Type.Literal("petrol"),
            Type.Literal("electric"),
            Type.Literal("coal/wood"),
            Type.Literal("other")
          ])),
          "used": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
        }, {"description":"Data about the engine's Fuel Supply"})),
      "intakeManifoldTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "label": Type.Optional(Type.String({"description":"Human readable label for the propulsion unit"})),
      "oilPressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "oilTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "revolutions": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "runTime": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "state": Type.Optional(Type.Intersect([
        Type.Ref("signalk://schemas/definitions#CommonValueFields"),
        Type.Object({
            "value": Type.Optional(Type.Union([
              Type.Literal("stopped"),
              Type.Literal("started"),
              Type.Literal("unusable")
            ]))
          })
      ])),
      "temperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "transmission": Type.Optional(Type.Object({
          "gear": Type.Optional(Type.Intersect([
            Type.Ref("signalk://schemas/definitions#CommonValueFields"),
            Type.Object({
                "value": Type.Optional(Type.Union([
                  Type.Literal("Forward"),
                  Type.Literal("Neutral"),
                  Type.Literal("Reverse"),
                  Type.Literal("Fault")
                ]))
              })
          ])),
          "gearRatio": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "oilPressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "oilTemperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
        }, {"description":"The transmission (gear box) of the named engine"}))
    }, {"description":"This regex pattern is used for validation of the identifier for the propulsion unit"}))
export type Propulsion = Type.Static<typeof PropulsionSchema>
