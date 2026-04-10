// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/design.json
import { Type } from 'typebox'

export const DesignSchema = Type.Object({
    "airHeight": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "aisShipType": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Intersect([
            Type.Object({
                "id": Type.Optional(Type.Number({"description":"The ship type number"})),
                "name": Type.Optional(Type.String({"description":"The ship type name"}))
              }),
            Type.Union([
              Type.Literal({"id":20,"name":"Wing In Ground"}),
              Type.Literal({"id":21,"name":"Wing In Ground hazard cat A"}),
              Type.Literal({"id":22,"name":"Wing In Ground hazard cat B"}),
              Type.Literal({"id":23,"name":"Wing In Ground hazard cat C"}),
              Type.Literal({"id":24,"name":"Wing In Ground hazard cat D"}),
              Type.Literal({"id":25,"name":"Wing In Ground"}),
              Type.Literal({"id":26,"name":"Wing In Ground"}),
              Type.Literal({"id":27,"name":"Wing In Ground"}),
              Type.Literal({"id":28,"name":"Wing In Ground"}),
              Type.Literal({"id":29,"name":"Wing In Ground (no other information)"}),
              Type.Literal({"id":30,"name":"Fishing"}),
              Type.Literal({"id":31,"name":"Towing"}),
              Type.Literal({"id":32,"name":"Towing exceeds 200m or wider than 25m"}),
              Type.Literal({"id":33,"name":"Engaged in dredging or underwater operations"}),
              Type.Literal({"id":34,"name":"Engaged in diving operations"}),
              Type.Literal({"id":35,"name":"Engaged in military operations"}),
              Type.Literal({"id":36,"name":"Sailing"}),
              Type.Literal({"id":37,"name":"Pleasure"}),
              Type.Literal({"id":40,"name":"High speed craft"}),
              Type.Literal({"id":41,"name":"High speed craft carrying dangerous goods"}),
              Type.Literal({"id":42,"name":"High speed craft hazard cat B"}),
              Type.Literal({"id":43,"name":"High speed craft hazard cat C"}),
              Type.Literal({"id":44,"name":"High speed craft hazard cat D"}),
              Type.Literal({"id":45,"name":"High speed craft"}),
              Type.Literal({"id":46,"name":"High speed craft"}),
              Type.Literal({"id":47,"name":"High speed craft"}),
              Type.Literal({"id":48,"name":"High speed craft"}),
              Type.Literal({"id":49,"name":"High speed craft (no additional information)"}),
              Type.Literal({"id":50,"name":"Pilot vessel"}),
              Type.Literal({"id":51,"name":"SAR"}),
              Type.Literal({"id":52,"name":"Tug"}),
              Type.Literal({"id":53,"name":"Port tender"}),
              Type.Literal({"id":54,"name":"Anti-pollution"}),
              Type.Literal({"id":55,"name":"Law enforcement"}),
              Type.Literal({"id":56,"name":"Spare"}),
              Type.Literal({"id":57,"name":"Spare #2"}),
              Type.Literal({"id":58,"name":"Medical"}),
              Type.Literal({"id":59,"name":"RR Resolution No.18"}),
              Type.Literal({"id":60,"name":"Passenger ship"}),
              Type.Literal({"id":61,"name":"Passenger ship hazard cat A"}),
              Type.Literal({"id":62,"name":"Passenger ship hazard cat B"}),
              Type.Literal({"id":63,"name":"Passenger ship hazard cat C"}),
              Type.Literal({"id":64,"name":"Passenger ship hazard cat D"}),
              Type.Literal({"id":65,"name":"Passenger ship"}),
              Type.Literal({"id":66,"name":"Passenger ship"}),
              Type.Literal({"id":67,"name":"Passenger ship"}),
              Type.Literal({"id":68,"name":"Passenger ship"}),
              Type.Literal({"id":69,"name":"Passenger ship (no additional information)"}),
              Type.Literal({"id":70,"name":"Cargo ship"}),
              Type.Literal({"id":71,"name":"Cargo ship carrying dangerous goods"}),
              Type.Literal({"id":72,"name":"Cargo ship hazard cat B"}),
              Type.Literal({"id":73,"name":"Cargo ship hazard cat C"}),
              Type.Literal({"id":74,"name":"Cargo ship hazard cat D"}),
              Type.Literal({"id":75,"name":"Cargo ship"}),
              Type.Literal({"id":76,"name":"Cargo ship"}),
              Type.Literal({"id":77,"name":"Cargo ship"}),
              Type.Literal({"id":78,"name":"Cargo ship"}),
              Type.Literal({"id":79,"name":"Cargo ship (no additional information)"}),
              Type.Literal({"id":80,"name":"Tanker"}),
              Type.Literal({"id":81,"name":"Tanker carrying dangerous goods"}),
              Type.Literal({"id":82,"name":"Tanker hazard cat B"}),
              Type.Literal({"id":83,"name":"Tanker hazard cat C"}),
              Type.Literal({"id":84,"name":"Tanker hazard cat D"}),
              Type.Literal({"id":85,"name":"Tanker"}),
              Type.Literal({"id":86,"name":"Tanker"}),
              Type.Literal({"id":87,"name":"Tanker"}),
              Type.Literal({"id":88,"name":"Tanker"}),
              Type.Literal({"id":89,"name":"Tanker (no additional information)"}),
              Type.Literal({"id":90,"name":"Other"}),
              Type.Literal({"id":91,"name":"Other carrying dangerous goods"}),
              Type.Literal({"id":92,"name":"Other hazard cat B"}),
              Type.Literal({"id":93,"name":"Other hazard cat C"}),
              Type.Literal({"id":94,"name":"Other hazard cat D"}),
              Type.Literal({"id":95,"name":"Other"}),
              Type.Literal({"id":96,"name":"Other"}),
              Type.Literal({"id":97,"name":"Other"}),
              Type.Literal({"id":98,"name":"Other"}),
              Type.Literal({"id":99,"name":"Other (no additional information)"})
            ])
          ]))
        })
    ])),
    "beam": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "displacement": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "draft": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields")
    ])),
    "keel": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields")
    ])),
    "length": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields")
    ])),
    "rigging": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields")
    ]))
  }, {"$id":"signalk://schemas/groups/design","description":"An object describing the vessels primary dimensions and statistics.","title":"design"})
export type Design = Type.Static<typeof DesignSchema>
