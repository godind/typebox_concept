// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/aircraft.json
import { Type } from 'typebox'

export const AircraftSchema = Type.Union([
  Type.Object({
      "mmsi": Type.Ref("signalk://schemas/definitions#AircraftMmsi")
    }),
  Type.Object({
      "url": Type.Ref("signalk://schemas/definitions#Url")
    }),
  Type.Object({
      "uuid": Type.Ref("signalk://schemas/definitions#Uuid")
    })
], { $id: "signalk://schemas/aircraft" })
export type Aircraft = Type.Static<typeof AircraftSchema>
