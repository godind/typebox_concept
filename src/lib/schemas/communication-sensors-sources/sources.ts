// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/sources.json
import { Type } from 'typebox'

export const SourcesSchema = Type.Record(Type.String(), Type.Object({
      "label": Type.Optional(Type.String({"description":"Sources unique name e.g. [type-bus].[id], N2000-01.034","examples":["N2000-01.034"]})),
      "type": Type.Optional(Type.String({"description":"Type of interface i.e. signalk, NMEA0183 or NMEA2000","examples":["NMEA0183"]}))
    }))
export type Sources = Type.Static<typeof SourcesSchema>
