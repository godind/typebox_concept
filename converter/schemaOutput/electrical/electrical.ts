// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/electrical.json
import { Type } from 'typebox'

export const ElectricalSchema = Type.Object({
    "ac": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity")
      ]))),
    "alternators": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity"),
        Type.Ref("signalk://schemas/groups/electrical#DcQualities"),
        Type.Ref("signalk://schemas/groups/electrical#ChargerQualities")
      ]))),
    "batteries": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity"),
        Type.Ref("signalk://schemas/groups/electrical#DcQualities")
      ]))),
    "chargers": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity"),
        Type.Ref("signalk://schemas/groups/electrical#DcQualities"),
        Type.Ref("signalk://schemas/groups/electrical#ChargerQualities")
      ]))),
    "inverters": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity")
      ]))),
    "solar": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9]+$)"}), Type.Intersect([
        Type.Ref("signalk://schemas/groups/electrical#Identity"),
        Type.Ref("signalk://schemas/groups/electrical#DcQualities"),
        Type.Ref("signalk://schemas/groups/electrical#ChargerQualities")
      ])))
  }, {"$id":"signalk://schemas/groups/electrical","description":"Schema describing the electrical child-object of a Vessel.","title":"Electrical Properties"})
export type Electrical = Type.Static<typeof ElectricalSchema>
export const AcQualitiesSchema = Type.Object({
    "apparentPower": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "associatedBus": Type.Optional(Type.String({"description":"Name of BUS device is associated with"})),
    "current": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "frequency": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "lineLineVoltage": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "lineNeutralVoltage": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "powerFactor": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "powerFactorLagging": Type.Optional(Type.Union([
      Type.Literal("leading"),
      Type.Literal("lagging"),
      Type.Literal("error"),
      Type.Literal("not available")
    ])),
    "reactivePower": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "realPower": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
  }, {"$id":"signalk://schemas/groups/electrical#AcQualities","description":"AC equipment common qualities","title":"AC Qualities"})
export type AcQualities = Type.Static<typeof AcQualitiesSchema>
export const ChargerQualitiesSchema = Type.Object({
    "chargerRole": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Union([
            Type.Literal("standalone"),
            Type.Literal("master"),
            Type.Literal("slave"),
            Type.Literal("standby")
          ]))
        })
    ])),
    "chargingAlgorithm": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Union([
            Type.Literal("trickle"),
            Type.Literal("two stage"),
            Type.Literal("three stage"),
            Type.Literal("four stage"),
            Type.Literal("constant current"),
            Type.Literal("constant voltage"),
            Type.Literal("custom profile")
          ]))
        })
    ])),
    "chargingMode": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Union([
            Type.Literal("bulk"),
            Type.Literal("acceptance"),
            Type.Literal("overcharge"),
            Type.Literal("float"),
            Type.Literal("equalize"),
            Type.Literal("unknown"),
            Type.Literal("other")
          ]))
        })
    ])),
    "setpointCurrent": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "setpointVoltage": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
  }, {"$id":"signalk://schemas/groups/electrical#ChargerQualities","description":"Common charger qualities","title":"Charger Qualities"})
export type ChargerQualities = Type.Static<typeof ChargerQualitiesSchema>
export const DcQualitiesSchema = Type.Object({
    "associatedBus": Type.Optional(Type.String({"description":"Name of BUS device is associated with"})),
    "current": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#NumberValue"),
      Type.Object({
          "meta": Type.Optional(Type.Object({
              "faultLower": Type.Optional(Type.Number({"description":"Lower fault current limit - device may disable/disconnect"})),
              "faultUpper": Type.Optional(Type.Number({"description":"Upper fault current limit - device may disable/disconnect"})),
              "warnLower": Type.Optional(Type.Number({"description":"Lower operational current limit"})),
              "warnUpper": Type.Optional(Type.Number({"description":"Upper operational current limit"}))
            }))
        })
    ])),
    "temperature": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#NumberValue"),
      Type.Object({
          "faultLower": Type.Optional(Type.Number({"description":"Lower fault temperature limit - device may disable/disconnect"})),
          "faultUpper": Type.Optional(Type.Number({"description":"Upper fault temperature limit - device may disable/disconnect"})),
          "warnLower": Type.Optional(Type.Number({"description":"Lower operational temperature limit"})),
          "warnUpper": Type.Optional(Type.Number({"description":"Upper operational temperature limit"}))
        })
    ])),
    "voltage": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#NumberValue"),
      Type.Object({
          "meta": Type.Optional(Type.Object({
              "faultLower": Type.Optional(Type.Number({"description":"Lower fault voltage limit - device may disable/disconnect"})),
              "faultUpper": Type.Optional(Type.Number({"description":"Upper fault voltage limit - device may disable/disconnect"})),
              "nominal": Type.Optional(Type.Number({"description":"Designed 'voltage' of device (12v, 24v, 32v, 36v, 42v, 48v, 144v, etc.)"})),
              "warnLower": Type.Optional(Type.Number({"description":"Lower operational voltage limit"})),
              "warnUpper": Type.Optional(Type.Number({"description":"Upper operational voltage limit"}))
            })),
          "ripple": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
        })
    ]))
  }, {"$id":"signalk://schemas/groups/electrical#DcQualities","description":"DC common qualities","title":"DC Qualities"})
export type DcQualities = Type.Static<typeof DcQualitiesSchema>
export const IdentitySchema = Type.Object({
    "dateInstalled": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "location": Type.Optional(Type.String({"description":"Installed location of device on vessel"})),
    "manufacturer": Type.Optional(Type.Object({
        "model": Type.Optional(Type.String({"description":"Model or part number"})),
        "name": Type.Optional(Type.String({"description":"Manufacturer's name"})),
        "URL": Type.Optional(Type.String({"description":"Web referance / URL"}))
      })),
    "name": Type.Optional(Type.String({"description":"Unique ID of device (houseBattery, alternator, Generator, solar1, inverter, charger, combiner, etc.)"}))
  }, {"$id":"signalk://schemas/groups/electrical#Identity","description":" Common ID items shared by electrical items","title":"Electrical ID"})
export type Identity = Type.Static<typeof IdentitySchema>
