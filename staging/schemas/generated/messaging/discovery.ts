// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/discovery.json
import { Type } from 'typebox'

export const DiscoverySchema = Type.Object({
    "endpoints": Type.Optional(Type.Record(Type.String(), Type.Object({
          "signalk-http": Type.Optional(Type.Ref("signalk://schemas/definitions#Url")),
          "signalk-tcp": Type.Optional(Type.Ref("signalk://schemas/definitions#Url")),
          "signalk-ws": Type.Optional(Type.Ref("signalk://schemas/definitions#Url")),
          "version": Type.Ref("signalk://schemas/definitions#Version")
        }, {"description":"The name of a group of endpoints at the same version level"}))),
    "server": Type.Optional(Type.Object({
        "id": Type.String({"description":"The id of this server (signalk-server-node, iKommunicate, etc.)"}),
        "version": Type.String({"description":"The version of this server (not limited to signalk versioning rules)."})
      }, {"description":"Information about this server"}))
  }, {"$id":"signalk://schemas/discovery","description":"Schema for SignalK discovery resources used to locate server endpoints.","title":"SignalK Discovery"})
export type Discovery = Type.Static<typeof DiscoverySchema>
