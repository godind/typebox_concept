// Generated from SignalK specification master — do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/definitions.json
import { Type } from 'typebox'

export const TimestampSchema = Type.String({"$id":"signalk://schemas/definitions#Timestamp","format":"date-time","pattern":".*Z$","description":"RFC 3339 (UTC only without local offset) string representing date and time.","examples":["2014-04-10T08:33:53Z"]})
export type Timestamp = Type.Static<typeof TimestampSchema>

export const SourceRefSchema = Type.String({"$id":"signalk://schemas/definitions#SourceRef","pattern":"^[A-Za-z0-9-_.]*$","description":"Reference to the source under /sources. A dot spearated path to the data. eg [type].[bus].[device]","examples":["NMEA0183.COM1.GP"]})
export type SourceRef = Type.Static<typeof SourceRefSchema>

export const MmsiSchema = Type.String({"$id":"signalk://schemas/definitions#Mmsi","pattern":"^[2-7][0-9]{8}$","description":"Maritime Mobile Service Identity (MMSI). Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["503123456"]})
export type Mmsi = Type.Static<typeof MmsiSchema>

export const AlarmStateSchema = Type.Union([
  Type.Literal("nominal"),
  Type.Literal("normal"),
  Type.Literal("alert"),
  Type.Literal("warn"),
  Type.Literal("alarm"),
  Type.Literal("emergency")
], { $id: "signalk://schemas/definitions#AlarmState" })
export type AlarmState = Type.Static<typeof AlarmStateSchema>

export const NumberValueSchema = Type.Intersect([
  Type.Ref(CommonValueFieldsSchema),
  Type.Object({
      "value": Type.Optional(Type.Number()),
      "values": Type.Optional(Type.Record(Type.String(), Type.Ref(ValuesNumberValueSchema)))
    })
], { $id: "signalk://schemas/definitions#NumberValue" })
export type NumberValue = Type.Static<typeof NumberValueSchema>

export const PositionSchema = Type.Intersect([
  Type.Ref(CommonValueFieldsSchema),
  Type.Object({
      "value": Type.Optional(Type.Object({
          "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
          "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
          "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
        })),
      "values": Type.Optional(Type.Record(Type.String(), Type.Object({
            "pgn": Type.Optional(Type.Number()),
            "sentence": Type.Optional(Type.String()),
            "timestamp": Type.Optional(Type.Ref(TimestampSchema)),
            "value": Type.Optional(Type.Object({
                "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
                "latitude": Type.Optional(Type.Number({"description":"Latitude","examples":[52.0987654]})),
                "longitude": Type.Optional(Type.Number({"description":"Longitude","examples":[4.98765245]}))
              }))
          })))
    })
], { $id: "signalk://schemas/definitions#Position" })
export type Position = Type.Static<typeof PositionSchema>
