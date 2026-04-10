// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/aton.json
import { Type } from 'typebox'

export const AtonSchema = Type.Union([
  Type.Object({
      "mmsi": Type.Ref("signalk://schemas/definitions#AtonMmsi")
    }),
  Type.Object({
      "url": Type.Ref("signalk://schemas/definitions#Url")
    }),
  Type.Object({
      "uuid": Type.Ref("signalk://schemas/definitions#Uuid")
    })
], { $id: "signalk://schemas/aton" })
export type Aton = Type.Static<typeof AtonSchema>
