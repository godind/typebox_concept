// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/sails.json
import { Type } from 'typebox'

export const SailsSchema = Type.Object({
    "area": Type.Optional(Type.Object({
        "active": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "total": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"An object containing information about the vessels' sails."})),
    "inventory": Type.Optional(Type.Record(Type.String({"pattern":"(^[a-zA-Z0-9]+$)"}), Type.Object({
          "_attr": Type.Optional(Type.Ref("signalk://schemas/definitions#_attr")),
          "active": Type.Boolean(),
          "area": Type.Number({"description":"The total area of this sail in square meters"}),
          "brand": Type.Optional(Type.String({"description":"The brand of the sail (optional)","examples":["North Sails"]})),
          "material": Type.Optional(Type.String({"description":"The material the sail is made from (optional)","examples":["canvas"]})),
          "maximumWind": Type.Optional(Type.Number({"description":"The maximum wind speed this sail can be used with","default":666})),
          "meta": Type.Optional(Type.Ref("signalk://schemas/definitions#Meta")),
          "minimumWind": Type.Optional(Type.Number({"description":"The minimum wind speed this sail can be used with","default":0})),
          "name": Type.String({"description":"An unique identifier by which the crew identifies a sail","examples":["J1"]}),
          "reducedState": Type.Optional(Type.Object({
              "furledRatio": Type.Optional(Type.Number({"description":"Ratio of sail reduction, 0 means full and 1 is completely furled in","default":0})),
              "reduced": Type.Optional(Type.Boolean()),
              "reefs": Type.Optional(Type.Number({"description":"Number of reefs set, 0 means full","default":0}))
            }, {"description":"An object describing reduction of sail area"})),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
          "type": Type.String({"description":"The type of sail","examples":["Genaker"]})
        }, {"description":"'sail' data type."})))
  }, {"$id":"signalk://schemas/groups/sails","description":"An object describing the vessels sails if the vessel is a sailboat.","title":"sails"})
export type Sails = Type.Static<typeof SailsSchema>
