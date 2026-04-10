// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/sar.json
import { Type } from 'typebox'

export const SarSchema = Type.Union([
  Type.Object({
      "mmsi": Type.Ref("signalk://schemas/definitions#SarMmsi")
    }),
  Type.Object({
      "url": Type.Ref("signalk://schemas/definitions#Url")
    }),
  Type.Object({
      "uuid": Type.Ref("signalk://schemas/definitions#Uuid")
    })
], { $id: "signalk://schemas/sar" })
export type Sar = Type.Static<typeof SarSchema>
