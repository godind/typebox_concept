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
              Type.Object({
                "id": Type.Literal(20),
                "name": Type.Literal("Wing In Ground")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(21),
                "name": Type.Literal("Wing In Ground hazard cat A")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(22),
                "name": Type.Literal("Wing In Ground hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(23),
                "name": Type.Literal("Wing In Ground hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(24),
                "name": Type.Literal("Wing In Ground hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(25),
                "name": Type.Literal("Wing In Ground")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(26),
                "name": Type.Literal("Wing In Ground")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(27),
                "name": Type.Literal("Wing In Ground")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(28),
                "name": Type.Literal("Wing In Ground")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(29),
                "name": Type.Literal("Wing In Ground (no other information)")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(30),
                "name": Type.Literal("Fishing")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(31),
                "name": Type.Literal("Towing")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(32),
                "name": Type.Literal("Towing exceeds 200m or wider than 25m")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(33),
                "name": Type.Literal("Engaged in dredging or underwater operations")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(34),
                "name": Type.Literal("Engaged in diving operations")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(35),
                "name": Type.Literal("Engaged in military operations")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(36),
                "name": Type.Literal("Sailing")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(37),
                "name": Type.Literal("Pleasure")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(40),
                "name": Type.Literal("High speed craft")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(41),
                "name": Type.Literal("High speed craft carrying dangerous goods")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(42),
                "name": Type.Literal("High speed craft hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(43),
                "name": Type.Literal("High speed craft hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(44),
                "name": Type.Literal("High speed craft hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(45),
                "name": Type.Literal("High speed craft")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(46),
                "name": Type.Literal("High speed craft")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(47),
                "name": Type.Literal("High speed craft")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(48),
                "name": Type.Literal("High speed craft")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(49),
                "name": Type.Literal("High speed craft (no additional information)")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(50),
                "name": Type.Literal("Pilot vessel")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(51),
                "name": Type.Literal("SAR")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(52),
                "name": Type.Literal("Tug")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(53),
                "name": Type.Literal("Port tender")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(54),
                "name": Type.Literal("Anti-pollution")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(55),
                "name": Type.Literal("Law enforcement")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(56),
                "name": Type.Literal("Spare")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(57),
                "name": Type.Literal("Spare #2")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(58),
                "name": Type.Literal("Medical")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(59),
                "name": Type.Literal("RR Resolution No.18")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(60),
                "name": Type.Literal("Passenger ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(61),
                "name": Type.Literal("Passenger ship hazard cat A")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(62),
                "name": Type.Literal("Passenger ship hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(63),
                "name": Type.Literal("Passenger ship hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(64),
                "name": Type.Literal("Passenger ship hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(65),
                "name": Type.Literal("Passenger ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(66),
                "name": Type.Literal("Passenger ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(67),
                "name": Type.Literal("Passenger ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(68),
                "name": Type.Literal("Passenger ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(69),
                "name": Type.Literal("Passenger ship (no additional information)")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(70),
                "name": Type.Literal("Cargo ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(71),
                "name": Type.Literal("Cargo ship carrying dangerous goods")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(72),
                "name": Type.Literal("Cargo ship hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(73),
                "name": Type.Literal("Cargo ship hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(74),
                "name": Type.Literal("Cargo ship hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(75),
                "name": Type.Literal("Cargo ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(76),
                "name": Type.Literal("Cargo ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(77),
                "name": Type.Literal("Cargo ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(78),
                "name": Type.Literal("Cargo ship")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(79),
                "name": Type.Literal("Cargo ship (no additional information)")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(80),
                "name": Type.Literal("Tanker")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(81),
                "name": Type.Literal("Tanker carrying dangerous goods")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(82),
                "name": Type.Literal("Tanker hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(83),
                "name": Type.Literal("Tanker hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(84),
                "name": Type.Literal("Tanker hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(85),
                "name": Type.Literal("Tanker")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(86),
                "name": Type.Literal("Tanker")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(87),
                "name": Type.Literal("Tanker")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(88),
                "name": Type.Literal("Tanker")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(89),
                "name": Type.Literal("Tanker (no additional information)")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(90),
                "name": Type.Literal("Other")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(91),
                "name": Type.Literal("Other carrying dangerous goods")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(92),
                "name": Type.Literal("Other hazard cat B")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(93),
                "name": Type.Literal("Other hazard cat C")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(94),
                "name": Type.Literal("Other hazard cat D")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(95),
                "name": Type.Literal("Other")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(96),
                "name": Type.Literal("Other")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(97),
                "name": Type.Literal("Other")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(98),
                "name": Type.Literal("Other")
              }, {"additionalProperties":false}),
              Type.Object({
                "id": Type.Literal(99),
                "name": Type.Literal("Other (no additional information)")
              }, {"additionalProperties":false})
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
