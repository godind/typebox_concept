// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/hello.json
import { Type } from 'typebox'

export const HelloSchema = Type.Object({
    "name": Type.Optional(Type.String({"description":"The name of the Signal K server software","examples":["iKommunicate"]})),
    "playbackRate": Type.Optional(Type.Number({"description":"Playback rate for history playback connections: 1 is real time, 2 is two times and 0.5 half the real time rate"})),
    "roles": /* oneOf->Union: exclusivity restored via disjointness proof (tuple branches are pairwise disjoint by length/literal position constraints) */ Type.Union([
      Type.Tuple([Type.Literal("master"), Type.Union([
          Type.Literal("main"),
          Type.Literal("aux")
        ])], {"minItems":2,"maxItems":2}),
      Type.Tuple([Type.Literal("slave")], {"minItems":1,"maxItems":1})
    ]),
    "self": Type.Optional(/* oneOf->Union: exclusivity restored via disjointness proof (string branches are disjoint by anchored prefix tokens (vessels, aircraft, aton, sar)) */ Type.Union([
      Type.String({"pattern":"^vessels.(urn:mrn:(imo:mmsi:[2-7][0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$","format":"signalk-self-vessel-id"}),
      Type.String({"pattern":"^aircraft.(urn:mrn:(imo:mmsi:1[0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$","format":"signalk-self-aircraft-id"}),
      Type.String({"pattern":"^aton.(urn:mrn:(imo:mmsi:99[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$","format":"signalk-self-aton-id"}),
      Type.String({"pattern":"^sar.(urn:mrn:(imo:mmsi:97[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$","format":"signalk-self-sar-id"})
    ])),
    "startTime": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
    "version": Type.Ref("signalk://schemas/definitions#Version")
  }, {"$id":"signalk://schemas/hello","description":"Schema for defining the hello message passed from the server to a client following succesful websocket connection","title":"SignalK Websockets Hello message schema","additionalProperties":false})
export type Hello = Type.Static<typeof HelloSchema>
