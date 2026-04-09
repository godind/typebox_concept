// Generated from SignalK specification master — do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/definitions.json
import { Type } from 'typebox'

export const _attrSchema = Type.Object({
    "_group": Type.Optional(Type.String({"description":"The group owning this resource.","title":"_group schema.","default":"self"})),
    "_mode": Type.Optional(Type.Integer({"description":"Unix style permissions, often written in `owner:group:other` form, `-rw-r--r--`","title":"_mode schema.","default":644})),
    "_owner": Type.Optional(Type.String({"description":"The owner of this resource.","title":"_owner schema.","default":"self"}))
  }, {"$id":"signalk://schemas/definitions#_attr","description":"Filesystem specific data, e.g. security, possibly more later.","title":"_attr schema."})
export type _attr = Type.Static<typeof _attrSchema>

export const AlarmMethodEnumSchema = Type.Union([
  Type.Literal("visual"),
  Type.Literal("sound")
], { $id: "signalk://schemas/definitions#AlarmMethodEnum" })
export type AlarmMethodEnum = Type.Static<typeof AlarmMethodEnumSchema>

export const AlarmStateSchema = Type.Union([
  Type.Literal("nominal"),
  Type.Literal("normal"),
  Type.Literal("alert"),
  Type.Literal("warn"),
  Type.Literal("alarm"),
  Type.Literal("emergency")
], { $id: "signalk://schemas/definitions#AlarmState" })
export type AlarmState = Type.Static<typeof AlarmStateSchema>

export const MetaSchema = Type.Object({
    "alarmMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "alertMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "description": Type.String({"description":"Description of the SK path.","title":"Description schema.","examples":["Engine revolutions (x60 for RPM)"]}),
    "displayName": Type.Optional(Type.String({"description":"A display name for this value. This is shown on the gauge and should not include units.","title":"DisplayName schema.","examples":["Tachometer, Engine 1"]})),
    "displayScale": Type.Optional(/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) 0,1 */ Type.Union([
      Type.Object({
          "lower": Type.Unknown(),
          "upper": Type.Unknown()
        }, {"additionalProperties":false}),
      Type.Object({
          "lower": Type.Unknown(),
          "type": Type.Union([
            Type.Literal("linear"),
            Type.Literal("squareroot"),
            Type.Literal("logarithmic")
          ]),
          "upper": Type.Unknown()
        }, {"additionalProperties":false}),
      Type.Object({
          "lower": Type.Unknown(),
          "power": Type.Unknown(),
          "type": Type.Literal("power"),
          "upper": Type.Unknown()
        }, {"additionalProperties":false})
    ])),
    "emergencyMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "enum": Type.Optional(Type.Array(Type.Unknown())),
    "gaugeType": Type.Optional(Type.String({"description":"gaugeType is deprecated. The type of gauge necessary to display this value.","title":"gaugeType schema.","examples":["sparkline"]})),
    "longName": Type.Optional(Type.String({"description":"A long name for this value.","title":"LongName schema.","examples":["Tachometer, Engine 1"]})),
    "properties": Type.Optional(Type.Record(Type.String(), Type.Object({
          "description": Type.Optional(Type.String()),
          "example": Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Object({})])),
          "title": Type.Optional(Type.String()),
          "type": Type.Optional(Type.String()),
          "units": Type.Optional(Type.String())
        }))),
    "shortName": Type.Optional(Type.String({"description":"A short name for this value.","title":"ShortName schema.","examples":["Tacho 1"]})),
    "timeout": Type.Optional(Type.Number({"description":"The timeout in (fractional) seconds after which this data is invalid.","title":"Timeout","examples":[2]})),
    "units": Type.Optional(Type.String({"description":"The (derived) SI unit of this value.","title":"units schema.","examples":["m/s"]})),
    "warnMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "zones": Type.Optional(Type.Array(Type.Object({
        "lower": Type.Optional(Type.Number({"description":"The lowest number in this zone","title":"Lower","examples":[3500]})),
        "message": Type.Optional(Type.String({"description":"The message to display for the alarm.","title":"message","default":"Warning"})),
        "state": Type.Ref("signalk://schemas/definitions#AlarmState"),
        "upper": Type.Optional(Type.Number({"description":"The highest value in this zone","title":"Upper","examples":[4000]}))
      }, {"description":"A zone used to define the display and alarm state when the value is in between bottom and top.","title":"zone"})))
  }, {"$id":"signalk://schemas/definitions#Meta","description":"Provides meta data to enable alarm and display configuration.","title":"Meta schema."})
export type Meta = Type.Static<typeof MetaSchema>

export const SourceRefSchema = Type.String({"$id":"signalk://schemas/definitions#SourceRef","pattern":"^[A-Za-z0-9-_.]*$","description":"Reference to the source under /sources. A dot spearated path to the data. eg [type].[bus].[device]","examples":["NMEA0183.COM1.GP"]})
export type SourceRef = Type.Static<typeof SourceRefSchema>

export const TimestampSchema = Type.String({"$id":"signalk://schemas/definitions#Timestamp","format":"date-time","pattern":".*Z$","description":"RFC 3339 (UTC only without local offset) string representing date and time.","examples":["2014-04-10T08:33:53Z"]})
export type Timestamp = Type.Static<typeof TimestampSchema>

export const CommonValueFieldsSchema = Type.Object({
    "_attr": Type.Optional(Type.Ref("signalk://schemas/definitions#_attr")),
    "$source": Type.Ref("signalk://schemas/definitions#SourceRef"),
    "meta": Type.Optional(Type.Ref("signalk://schemas/definitions#Meta")),
    "pgn": Type.Optional(Type.Number()),
    "sentence": Type.Optional(Type.String()),
    "timestamp": Type.Ref("signalk://schemas/definitions#Timestamp")
  }, {"$id":"signalk://schemas/definitions#CommonValueFields"})
export type CommonValueFields = Type.Static<typeof CommonValueFieldsSchema>

export const MmsiSchema = Type.String({"$id":"signalk://schemas/definitions#Mmsi","pattern":"^[2-7][0-9]{8}$","description":"Maritime Mobile Service Identity (MMSI). Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["503123456"]})
export type Mmsi = Type.Static<typeof MmsiSchema>

export const ValuesNumberValueSchema = Type.Object({
    "pgn": Type.Optional(Type.Number()),
    "sentence": Type.Optional(Type.String()),
    "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "value": Type.Optional(Type.Number())
  }, {"$id":"signalk://schemas/definitions#ValuesNumberValue"})
export type ValuesNumberValue = Type.Static<typeof ValuesNumberValueSchema>

export const NumberValueSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.Number()),
      "values": Type.Optional(Type.Record(Type.String(), Type.Ref("signalk://schemas/definitions#ValuesNumberValue")))
    })
], { $id: "signalk://schemas/definitions#NumberValue" })
export type NumberValue = Type.Static<typeof NumberValueSchema>

export const PositionSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.Object({
          "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
          "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
          "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
        })),
      "values": Type.Optional(Type.Record(Type.String(), Type.Object({
            "pgn": Type.Optional(Type.Number()),
            "sentence": Type.Optional(Type.String()),
            "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
            "value": Type.Optional(Type.Object({
                "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
                "latitude": Type.Optional(Type.Number({"description":"Latitude","examples":[52.0987654]})),
                "longitude": Type.Optional(Type.Number({"description":"Longitude","examples":[4.98765245]}))
              }))
          })))
    })
], { $id: "signalk://schemas/definitions#Position" })
export type Position = Type.Static<typeof PositionSchema>
