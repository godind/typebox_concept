// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/notifications.json
import { Type } from 'typebox'

export const NotificationsSchema = Type.Object({}, {"$id":"signalk://schemas/groups/notifications","title":"notifications"})
export type Notifications = Type.Static<typeof NotificationsSchema>
export const NotificationSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.Object({
          "message": Type.String({"description":"Message to display or speak"}),
          "method": Type.Array(Type.Ref("signalk://schemas/definitions#AlarmMethodEnum")),
          "state": Type.Ref("signalk://schemas/definitions#AlarmState")
        }))
    })
], { $id: "signalk://schemas/groups/notifications#Notification" })
export type Notification = Type.Static<typeof NotificationSchema>
export const NotificationBranchSchema = Type.Record(Type.String({"pattern":"(^((?!^mob$|^fire$|^sinking$|^flooding$|^collision$|^grounding$|^listing$|^adrift$|^piracy$|^abandon$)[A-Za-z0-9-])+$)"}), /* oneOf->Union: exclusivity restored via disjointness proof (notifications recursive branch-vs-leaf oneOf proved disjoint by schema intent (notificationBranch vs notification refs)) */ Type.Union([
    Type.Ref("signalk://schemas/groups/notifications#NotificationBranch"),
    Type.Ref("signalk://schemas/groups/notifications#Notification")
  ]))
export type NotificationBranch = Type.Static<typeof NotificationBranchSchema>
