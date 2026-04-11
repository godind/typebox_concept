// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/definitions.json
import { Type } from 'typebox'

export const _attrSchema = Type.Object({
    "_group": Type.Optional(Type.String({"description":"The group owning this resource.","title":"_group schema.","default":"self"})),
    "_mode": Type.Optional(Type.Integer({"description":"Unix style permissions, often written in `owner:group:other` form, `-rw-r--r--`","title":"_mode schema.","default":644})),
    "_owner": Type.Optional(Type.String({"description":"The owner of this resource.","title":"_owner schema.","default":"self"}))
  }, {"$id":"signalk://schemas/definitions#_attr","description":"Filesystem specific data, e.g. security, possibly more later.","title":"_attr schema."})
export type _attr = Type.Static<typeof _attrSchema>

export const AircraftMmsiSchema = Type.String({"$id":"signalk://schemas/definitions#AircraftMmsi","pattern":"^1[0-9]{8}$","format":"signalk-aircraft-mmsi","description":"Maritime Mobile Service Identity (MMSI) for aircraft. Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["103123456"]})
export type AircraftMmsi = Type.Static<typeof AircraftMmsiSchema>

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

export const AtonMmsiSchema = Type.String({"$id":"signalk://schemas/definitions#AtonMmsi","pattern":"^99[0-9]{7}$","format":"signalk-aton-mmsi","description":"Maritime Mobile Service Identity (MMSI) for . Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["993123456"]})
export type AtonMmsi = Type.Static<typeof AtonMmsiSchema>

export const MetaSchema = Type.Object({
    "alarmMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "alertMethod": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum"))),
    "description": Type.Optional(Type.String({"description":"Description of the SK path.","title":"Description schema.","examples":["Engine revolutions (x60 for RPM)"]})),
    "displayName": Type.Optional(Type.String({"description":"A display name for this value. This is shown on the gauge and should not include units.","title":"DisplayName schema.","examples":["Tachometer, Engine 1"]})),
    "displayScale": Type.Optional(/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) 0,1 */ Type.Union([
      Type.Object({
          "lower": Type.Number({"description":"The suggested lower limit for the pointer (or equivalent) on the display","title":"Display lower limit.","examples":[0]}),
          "upper": Type.Number({"description":"The suggested upper limit for the pointer (or equivalent) on the display","title":"Display upper limit.","examples":[4000]})
        }, {"additionalProperties":false}),
      Type.Object({
          "lower": Type.Number({"description":"The suggested lower limit for the pointer (or equivalent) on the display","title":"Display lower limit.","examples":[0]}),
          "type": Type.Union([
            Type.Literal("linear"),
            Type.Literal("squareroot"),
            Type.Literal("logarithmic")
          ]),
          "upper": Type.Number({"description":"The suggested upper limit for the pointer (or equivalent) on the display","title":"Display upper limit.","examples":[4000]})
        }, {"additionalProperties":false}),
      Type.Object({
          "lower": Type.Number({"description":"The suggested lower limit for the pointer (or equivalent) on the display","title":"Display lower limit.","examples":[0]}),
          "power": Type.Number({"description":"The power to use when the displayScale/type is set to 'power'. Can be any numeric value except zero.","title":"Selected power for display scale","examples":[2]}),
          "type": Type.Literal("power"),
          "upper": Type.Number({"description":"The suggested upper limit for the pointer (or equivalent) on the display","title":"Display upper limit.","examples":[4000]})
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

export const SourceRefSchema = Type.String({"$id":"signalk://schemas/definitions#SourceRef","pattern":"^[A-Za-z0-9-_.]*$","format":"signalk-source-ref","description":"Reference to the source under /sources. A dot spearated path to the data. eg [type].[bus].[device]","examples":["NMEA0183.COM1.GP"]})
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

export const ValuesDatetimeValueSchema = Type.Object({
    "pgn": Type.Optional(Type.Number()),
    "sentence": Type.Optional(Type.String()),
    "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "value": Type.Optional(Type.String({"format":"date-time"}))
  }, {"$id":"signalk://schemas/definitions#ValuesDatetimeValue"})
export type ValuesDatetimeValue = Type.Static<typeof ValuesDatetimeValueSchema>

export const DatetimeValueSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.String({"format":"date-time"})),
      "values": Type.Optional(Type.Record(Type.String(), Type.Ref("signalk://schemas/definitions#ValuesDatetimeValue")))
    })
], { $id: "signalk://schemas/definitions#DatetimeValue" })
export type DatetimeValue = Type.Static<typeof DatetimeValueSchema>

export const GeohashSchema = Type.String({"$id":"signalk://schemas/definitions#Geohash","pattern":"^[0-9A-Za-z:]{1,}$","format":"signalk-geohash","description":"A geohash (see http://geohash.org)","examples":["eg rbe:TasmanBay"]})
export type Geohash = Type.Static<typeof GeohashSchema>

export const MmsiSchema = Type.String({"$id":"signalk://schemas/definitions#Mmsi","pattern":"^[2-7][0-9]{8}$","format":"signalk-vessel-mmsi","description":"Maritime Mobile Service Identity (MMSI). Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["503123456"]})
export type Mmsi = Type.Static<typeof MmsiSchema>

export const SourceSchema = Type.Object({
    "aisType": Type.Optional(Type.Number({"minimum":1,"maximum":27,"multipleOf":1,"description":"AIS Message Type","examples":["15"]})),
    "canName": Type.Optional(Type.String({"description":"NMEA2000 can name of the source device","examples":["13877444229283709432"]})),
    "instance": Type.Optional(Type.String({"description":"NMEA2000 instance value of the source message"})),
    "label": Type.String({"description":"A label to identify the source bus, eg serial-COM1, eth-local,etc . Can be anything but should follow a predicatable format","examples":["N2K-1"]}),
    "pgn": Type.Optional(Type.Number({"description":"NMEA2000 pgn of the source message","examples":["130312"]})),
    "sentence": Type.Optional(Type.String({"description":"Sentence type of the source NMEA0183 sentence, $GP[RMC],092750.000,A,5321.6802,N,00630.3372,W,0.02,31.66,280511,,,A*43","examples":["RMC"]})),
    "src": Type.Optional(Type.String({"description":"NMEA2000 src value or any similar value for encapsulating the original source of the data","examples":["36"]})),
    "talker": Type.Optional(Type.String({"description":"Talker id of the source NMEA0183 sentence, $[GP]RMC,092750.000,A,5321.6802,N,00630.3372,W,0.02,31.66,280511,,,A*43","examples":["GP"]})),
    "type": Type.Optional(Type.String({"description":"A human name to identify the type. NMEA0183, NMEA2000, signalk","default":"NMEA2000","examples":["NMEA2000"]}))
  }, {"$id":"signalk://schemas/definitions#Source","description":"Source of data in delta format, a record of where the data was received from. An object containing at least the properties defined in 'properties', but can contain anything beyond that."})
export type Source = Type.Static<typeof SourceSchema>

export const NullValueSchema = Type.Object({
    "_attr": Type.Optional(Type.Ref("signalk://schemas/definitions#_attr")),
    "meta": Type.Optional(Type.Ref("signalk://schemas/definitions#Meta")),
    "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
    "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "value": Type.Optional(Type.Null())
  }, {"$id":"signalk://schemas/definitions#NullValue","description":"Data should be of type NULL."})
export type NullValue = Type.Static<typeof NullValueSchema>

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

export const PositionValueSchema = Type.Object({
    "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
    "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
    "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
  }, {"$id":"signalk://schemas/definitions#PositionValue"})
export type PositionValue = Type.Static<typeof PositionValueSchema>

export const SarMmsiSchema = Type.String({"$id":"signalk://schemas/definitions#SarMmsi","pattern":"^97[0-9]{7}$","format":"signalk-sar-mmsi","description":"Maritime Mobile Service Identity (MMSI) for . Has to be 9 digits. See http://en.wikipedia.org/wiki/Maritime_Mobile_Service_Identity for information.","examples":["973123456"]})
export type SarMmsi = Type.Static<typeof SarMmsiSchema>

export const ValuesStringValueSchema = Type.Object({
    "pgn": Type.Optional(Type.Number()),
    "sentence": Type.Optional(Type.String()),
    "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "value": Type.Optional(Type.String())
  }, {"$id":"signalk://schemas/definitions#ValuesStringValue"})
export type ValuesStringValue = Type.Static<typeof ValuesStringValueSchema>

export const StringValueSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.String()),
      "values": Type.Optional(Type.Record(Type.String(), Type.Ref("signalk://schemas/definitions#ValuesStringValue")))
    })
], { $id: "signalk://schemas/definitions#StringValue" })
export type StringValue = Type.Static<typeof StringValueSchema>

export const UnitsSchema = Type.String({"$id":"signalk://schemas/definitions#Units","description":"Allowed units of physical quantities. Units should be (derived) SI units where possible."})
export type Units = Type.Static<typeof UnitsSchema>

export const UrlSchema = Type.String({"$id":"signalk://schemas/definitions#Url","description":"A location of a resource, potentially relative. For hierarchical schemes (like http), applications must resolve relative URIs (e.g. './v1/api/'). Implementations should support the following schemes: http:, https:, mailto:, tel:, and ws:.","examples":["http://localhost:8080/signalk/v1/api/vessels/self/environment"]})
export type Url = Type.Static<typeof UrlSchema>

export const UuidSchema = Type.String({"$id":"signalk://schemas/definitions#Uuid","pattern":"^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$","format":"signalk-uuid-urn","description":"A unique Signal K flavoured maritime resource identifier (MRN). A MRN is a form of URN, following a specific format: urn:mrn:<issueing authority>:<id type>:<id>. In case of a Signal K uuid, that looks like this: urn:mrn:signalk:uuid:<uuid>, where Signal K is the issuing authority and UUID (v4) the ID type.","examples":["urn:mrn:signalk:uuid:b7590868-1d62-47d9-989c-32321b349fb9"]})
export type Uuid = Type.Static<typeof UuidSchema>

export const VersionSchema = Type.String({"$id":"signalk://schemas/definitions#Version","pattern":"^[0-9]{1,3}[.][0-9]{1,2}[.][0-9]{1,2}($|-[a-zA-Z0-9]+$)","format":"signalk-version","description":"Version of the Signal K schema/APIs used by the root object.","examples":["1.5.0"]})
export type Version = Type.Static<typeof VersionSchema>

export const WaypointSchema = Type.Object({
    "feature": Type.Optional(Type.Object({
        "geometry": Type.Object({
            "coordinates": Type.Optional(Type.Array(Type.Number(), {"minItems":2})),
            "type": Type.Optional(Type.Literal("Point"))
          }, {"title":"Point"}),
        "id": Type.Optional(Type.Unknown()),
        "properties": Type.Union([Type.Object({}, {"description":"Additional data of any type"}), Type.Null()]),
        "type": Type.Optional(Type.Literal("Feature"))
      }, {"description":"A Geo JSON feature object","title":"Feature"})),
    "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position"))
  }, {"$id":"signalk://schemas/definitions#Waypoint","description":"A waypoint, an object with a signal k position object, and GeoJSON Feature object (see geojson.org, and https://github.com/fge/sample-json-schemas/tree/master/geojson)"})
export type Waypoint = Type.Static<typeof WaypointSchema>
