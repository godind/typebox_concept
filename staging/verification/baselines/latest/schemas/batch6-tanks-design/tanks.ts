// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/tanks.json
import { Type } from 'typebox'

export const TanksSchema = Type.Object({
    "baitWell": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "ballast": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "blackWater": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "freshWater": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "fuel": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "gas": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "liveWell": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "lubrication": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection")),
    "wasteWater": Type.Optional(Type.Ref("signalk://schemas/groups/tanks#TankCollection"))
  }, {"$id":"signalk://schemas/groups/tanks","description":"A tank, named by a unique identifier"})
export type Tanks = Type.Static<typeof TanksSchema>
export const TankCollectionSchema = Type.Record(Type.String(), Type.Object({
      "capacity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "currentLevel": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "currentVolume": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "extinguishant": Type.Optional(Type.Ref("signalk://schemas/definitions#StringValue")),
      "name": Type.Optional(Type.String({"description":"The name of the tank. Useful if multiple tanks of a certain type are on board"})),
      "pressure": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "temperature": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
      "type": Type.Optional(Type.Union([
        Type.Literal("petrol"),
        Type.Literal("fresh water"),
        Type.Literal("greywater"),
        Type.Literal("blackwater"),
        Type.Literal("holding"),
        Type.Literal("lpg"),
        Type.Literal("diesel"),
        Type.Literal("liveWell"),
        Type.Literal("baitWell"),
        Type.Literal("ballast"),
        Type.Literal("rum")
      ])),
      "viscosity": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
    }, {"description":"Tank, one or many, within the vessel"}))
export type TankCollection = Type.Static<typeof TankCollectionSchema>
