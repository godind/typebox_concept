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
