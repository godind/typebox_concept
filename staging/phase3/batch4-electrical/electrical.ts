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
