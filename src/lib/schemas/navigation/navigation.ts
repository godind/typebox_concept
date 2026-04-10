// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/navigation.json
import { Type } from 'typebox'

export const NavigationSchema = Type.Object({
    "anchor": Type.Optional(Type.Object({
        "currentRadius": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "maxRadius": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
        "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
        "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
      }, {"description":"The anchor data, for anchor watch etc","title":"anchor"})),
    "attitude": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Object({
              "pitch": Type.Optional(Type.Number({"description":"Pitch, +ve is bow up"})),
              "roll": Type.Optional(Type.Number({"description":"Vessel roll, +ve is list to starboard"})),
              "yaw": Type.Optional(Type.Number({"description":"Yaw, +ve is heading change to starboard"}))
            })),
          "values": Type.Optional(Type.Record(Type.String(), Type.Object({
                "pgn": Type.Optional(Type.Number()),
                "sentence": Type.Optional(Type.String()),
                "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
                "value": Type.Optional(Type.Object({
                    "pitch": Type.Optional(Type.Number({"description":"Pitch, +ve is bow up"})),
                    "roll": Type.Optional(Type.Number({"description":"Vessel roll, +ve is list to starboard"})),
                    "yaw": Type.Optional(Type.Number({"description":"Yaw, +ve is heading change to starboard"}))
                  }))
              })))
        })
    ])),
    "closestApproach": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Object({
              "distance": Type.Optional(Type.Number({"description":"Closest Point of Approach (CPA), distance between own vessel and other vessel, based on current speeds, headings and positions","examples":[31.2]})),
              "timeTo": Type.Optional(Type.Number({"description":"Time to Closest Point of Approach (TCPA), between own vessel and other vessel, based on current speeds, headings and positions","examples":[312]}))
            })),
          "values": Type.Optional(Type.Record(Type.String(), Type.Object({
                "pgn": Type.Optional(Type.Number()),
                "sentence": Type.Optional(Type.String()),
                "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
                "value": Type.Optional(Type.Object({
                    "distance": Type.Optional(Type.Number()),
                    "timeTo": Type.Optional(Type.Number())
                  }))
              })))
        })
    ])),
    "courseGreatCircle": Type.Optional(Type.Ref("signalk://schemas/groups/navigation#Course")),
    "courseOverGroundMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "courseOverGroundTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "courseRhumbline": Type.Optional(Type.Ref("signalk://schemas/groups/navigation#Course")),
    "datetime": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "gnssTimeSource": Type.Optional(Type.Union([
            Type.Literal("GPS"),
            Type.Literal("GLONASS"),
            Type.Literal("Galileo"),
            Type.Literal("Beidou"),
            Type.Literal("IRNSS"),
            Type.Literal("Radio Signal"),
            Type.Literal("Internet"),
            Type.Literal("Local clock")
          ])),
          "value": Type.Optional(Type.String({"format":"date-time","pattern":".*Z$","description":"GNSS Time and Date in RFC 3339 (UTC only without local offset) format","examples":["2015-12-05T13:11:59Z"]}))
        })
    ])),
    "destination": Type.Optional(Type.Object({
        "commonName": Type.Optional(Type.Ref("signalk://schemas/definitions#StringValue")),
        "eta": Type.Optional(Type.Ref("signalk://schemas/definitions#DatetimeValue")),
        "waypoint": Type.Optional(Type.Ref("signalk://schemas/definitions#StringValue"))
      }, {"description":"The intended destination of this trip","title":"destination"})),
    "gnss": Type.Optional(Type.Object({
        "antennaAltitude": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "differentialAge": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "differentialReference": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "geoidalSeparation": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "horizontalDilution": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "integrity": Type.Optional(Type.Intersect([
          Type.Ref("signalk://schemas/definitions#CommonValueFields")
        ])),
        "methodQuality": Type.Optional(Type.Intersect([
          Type.Ref("signalk://schemas/definitions#CommonValueFields")
        ])),
        "positionDilution": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "satellites": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "type": Type.Optional(Type.Intersect([
          Type.Ref("signalk://schemas/definitions#CommonValueFields")
        ]))
      }, {"description":"Global satellite navigation meta information","title":"gnss"})),
    "headingCompass": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "headingMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "headingTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "leewayAngle": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "lights": Type.Optional(Type.Object({
        "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
        "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
        "value": Type.Optional(Type.Union([
          Type.Literal("off"),
          Type.Literal("fault"),
          Type.Literal("anchored"),
          Type.Literal("sailing"),
          Type.Literal("motoring"),
          Type.Literal("towing < 200m"),
          Type.Literal("towing > 200m"),
          Type.Literal("pushing"),
          Type.Literal("fishing"),
          Type.Literal("fishing-hampered"),
          Type.Literal("trawling"),
          Type.Literal("trawling-shooting"),
          Type.Literal("trawling-hauling"),
          Type.Literal("pilotage"),
          Type.Literal("not-under-way"),
          Type.Literal("aground"),
          Type.Literal("restricted manouverability"),
          Type.Literal("restricted manouverability towing < 200m"),
          Type.Literal("restricted manouverability towing > 200m"),
          Type.Literal("restricted manouverability underwater operations"),
          Type.Literal("constrained by draft"),
          Type.Literal("mine clearance")
        ]))
      }, {"description":"Current state of the vessels navigation lights","title":"Navigation lights"})),
    "log": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "magneticDeviation": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "magneticVariation": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "magneticVariationAgeOfService": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "maneuver": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields")
    ])),
    "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
    "racing": Type.Optional(Type.Object({
        "distanceStartline": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "layline": Type.Optional(Type.Object({
            "distance": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
            "time": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
          }, {"description":"The layline crossing the current course"})),
        "oppositeLayline": Type.Optional(Type.Object({
            "distance": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
            "time": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
          }, {"description":"The layline parallell to current course"})),
        "startLinePort": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
        "startLineStb": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
        "timePortDown": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "timePortUp": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "timeStbdDown": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "timeStbdUp": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
        "timeToStart": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Specific navigational data related to yacht racing."})),
    "rateOfTurn": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "speedOverGround": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "speedThroughWater": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "speedThroughWaterLongitudinal": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "speedThroughWaterTransverse": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "state": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "value": Type.Optional(Type.Union([
            Type.Literal("not under command"),
            Type.Literal("anchored"),
            Type.Literal("moored"),
            Type.Literal("sailing"),
            Type.Literal("motoring"),
            Type.Literal("towing < 200m"),
            Type.Literal("towing > 200m"),
            Type.Literal("pushing"),
            Type.Literal("fishing"),
            Type.Literal("fishing-hampered"),
            Type.Literal("trawling"),
            Type.Literal("trawling-shooting"),
            Type.Literal("trawling-hauling"),
            Type.Literal("pilotage"),
            Type.Literal("not-under-way"),
            Type.Literal("aground"),
            Type.Literal("restricted manouverability"),
            Type.Literal("restricted manouverability towing < 200m"),
            Type.Literal("restricted manouverability towing > 200m"),
            Type.Literal("restricted manouverability underwater operations"),
            Type.Literal("constrained by draft"),
            Type.Literal("mine clearance"),
            Type.Literal("Reserved for future amendment of Navigational Status for HSC"),
            Type.Literal("Reserved for future amendment of Navigational Status for WIG"),
            Type.Literal("Reserved for future use-11"),
            Type.Literal("Reserved for future use-12"),
            Type.Literal("Reserved for future use-13"),
            Type.Literal("Reserved for future use-14"),
            Type.Literal("not defined (example)")
          ]))
        })
    ])),
    "trip": Type.Optional(Type.Object({
        "lastReset": Type.Optional(Type.Ref("signalk://schemas/definitions#DatetimeValue")),
        "log": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
      }, {"description":"Trip data"}))
  }, {"$id":"signalk://schemas/groups/navigation","description":"Schema describing the navigation child-object of a Vessel.","title":"navigation"})
export type Navigation = Type.Static<typeof NavigationSchema>
export const CourseSchema = Type.Object({
    "activeRoute": Type.Optional(Type.Object({
        "estimatedTimeOfArrival": Type.Optional(Type.Ref("signalk://schemas/definitions#DatetimeValue")),
        "href": Type.Optional(Type.String({"description":"A reference (URL) to the presently active route, in resources.","examples":["/resources/routes/urn:mrn:signalk:uuid:3dd34dcc-36bf-4d61-ba80-233799b25672"]})),
        "startTime": Type.Optional(Type.Ref("signalk://schemas/definitions#DatetimeValue"))
      }, {"description":"Data required if sailing to an active route, defined in resources."})),
    "bearingTrackMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "bearingTrackTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "crossTrackError": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "nextPoint": Type.Optional(Type.Union([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "bearingMagnetic": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "bearingTrue": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "distance": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "estimatedTimeOfArrival": Type.Optional(Type.Ref("signalk://schemas/definitions#DatetimeValue")),
          "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
          "timeToGo": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "value": Type.Optional(Type.Object({
              "href": Type.Optional(Type.String({"description":"A reference (URL) to an object (under resources) this point is related to"})),
              "type": Type.Optional(Type.String({"description":"The type of the next point (e.g. Waypoint, POI, Race Mark, etc)"}))
            })),
          "velocityMadeGood": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue"))
        })
    ])),
    "previousPoint": Type.Optional(Type.Intersect([
      Type.Ref("signalk://schemas/definitions#CommonValueFields"),
      Type.Object({
          "distance": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
          "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
          "value": Type.Optional(Type.Object({
              "href": Type.Optional(Type.String({"description":"A reference (URL) to an object (under resources) this point is related to"})),
              "type": Type.Optional(Type.String({"description":"The type of the previous point (e.g. Waypoint, POI, Race Mark, etc)"}))
            }))
        })
    ]))
  }, {"$id":"signalk://schemas/groups/navigation#Course","description":"The currently active course (can be a route, or just a point one is navigating towards)","title":"Course"})
export type Course = Type.Static<typeof CourseSchema>
