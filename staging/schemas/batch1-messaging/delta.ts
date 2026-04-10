// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/delta.json
import { Type } from 'typebox'

export const DeltaSchema = Type.Object({
    "context": Type.Optional(Type.String({"description":"The context path of the updates, eg. the top level path plus object identifier.","examples":["vessels.urn:mrn:signalk:uuid:6b0e776f-811a-4b35-980e-b93405371bc5"]})),
    "updates": Type.Array(/* oneOf->Union: exclusivity restored via additionalProperties:false on dominated branch(es) 0,1 */ Type.Union([
      Type.Object({
          "$source": Type.Optional(Type.Ref("signalk://schemas/definitions#SourceRef")),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
          "values": Type.Array(Type.Object({
              "path": Type.String({"description":"The local path to the data value","examples":["navigation.courseOverGroundMagnetic"]}),
              "value": Type.Union([Type.String(), Type.Number(), Type.Object({}), Type.Boolean(), Type.Null()])
            }))
        }, {"additionalProperties":false}),
      Type.Object({
          "$source": Type.Optional(Type.Ref("signalk://schemas/definitions#SourceRef")),
          "meta": Type.Array(Type.Object({
              "path": Type.String({"description":"The local path to the data value","examples":["navigation.courseOverGroundMagnetic"]}),
              "value": Type.Ref("signalk://schemas/definitions#Meta")
            })),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
        }, {"additionalProperties":false}),
      Type.Object({
          "$source": Type.Optional(Type.Ref("signalk://schemas/definitions#SourceRef")),
          "meta": Type.Array(Type.Object({
              "path": Type.String({"description":"The local path to the data value","examples":["navigation.courseOverGroundMagnetic"]}),
              "value": Type.Ref("signalk://schemas/definitions#Meta")
            })),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
          "values": Type.Array(Type.Object({
              "path": Type.String({"description":"The local path to the data value","examples":["navigation.courseOverGroundMagnetic"]}),
              "value": Type.Union([Type.String(), Type.Number(), Type.Object({}), Type.Boolean(), Type.Null()])
            }))
        }, {"additionalProperties":false})
    ]))
  }, {"$id":"signalk://schemas/delta","description":"Schema for defining updates and subscriptions to parts of a SignalK data model, for example for communicating updates of data","title":"SignalK Delta message schema"})
export type Delta = Type.Static<typeof DeltaSchema>
