// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/resources.json
import { Type } from 'typebox'

export const ResourcesSchema = Type.Object({
    "charts": Type.Optional(Type.Record(Type.String({"pattern":"(^[A-Za-z0-9_-]{8,}$)"}), Type.Object({
          "bounds": Type.Optional(Type.Array(Type.Ref("signalk://schemas/definitions#Position"))),
          "chartFormat": Type.Optional(Type.Union([
            Type.Literal("gif"),
            Type.Literal("geotiff"),
            Type.Literal("kap"),
            Type.Literal("png"),
            Type.Literal("jpg"),
            Type.Literal("kml"),
            Type.Literal("wkt"),
            Type.Literal("topojson"),
            Type.Literal("geojson"),
            Type.Literal("gpx"),
            Type.Literal("tms"),
            Type.Literal("wms"),
            Type.Literal("S-57"),
            Type.Literal("S-63"),
            Type.Literal("svg"),
            Type.Literal("other")
          ])),
          "chartLayers": Type.Optional(Type.Array(Type.String({"description":"Identifier for the layer."}))),
          "chartUrl": Type.Optional(Type.String({"description":"A url to the chart file's storage location","examples":["file:///home/pi/freeboard/mapcache/NZ615"]})),
          "description": Type.Optional(Type.String({"description":"A description of the chart"})),
          "geohash": Type.Optional(Type.Ref("signalk://schemas/definitions#Geohash")),
          "identifier": Type.Optional(Type.String({"description":"Chart number","examples":["NZ615"]})),
          "name": Type.Optional(Type.String({"description":"Chart common name","examples":["NZ615 Marlborough Sounds"]})),
          "region": Type.Optional(Type.String({"description":"Region related to note. A pointer to a region UUID. Alternative to geohash"})),
          "scale": Type.Optional(Type.Integer({"description":"The scale of the chart, the larger number from 1:200000"})),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "tilemapUrl": Type.Optional(Type.String({"description":"A url to the tilemap of the chart for use in TMS chartplotting apps","examples":["http://{server}:8080/mapcache/NZ615"]})),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
        }, {"description":"A chart"}))),
    "notes": Type.Optional(Type.Record(Type.String({"pattern":"^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"}), Type.Object({
          "description": Type.Optional(Type.String({"description":"A textual description of the note"})),
          "geohash": Type.Optional(Type.Ref("signalk://schemas/definitions#Geohash")),
          "mimeType": Type.Optional(Type.String({"description":"MIME type of the note"})),
          "position": Type.Optional(Type.Ref("signalk://schemas/definitions#Position")),
          "region": Type.Optional(Type.String({"description":"Region related to note. A pointer to a region UUID. Alternative to position or geohash"})),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
          "title": Type.Optional(Type.String({"description":"Note's common name"})),
          "url": Type.Optional(Type.String({"description":"Location of the note"}))
        }, {"description":"A note about a region, named with a UUID. Notes might include navigation or cruising info, images, or anything"}))),
    "regions": Type.Optional(Type.Record(Type.String({"pattern":"^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"}), Type.Object({
          "feature": Type.Optional(Type.Object({
              "geometry": /* oneOf->Union: exclusivity restored via disjointness proof (resources geometry oneOf branches are disjoint by GeoJSON type enum literals (Polygon, MultiPolygon)) */ Type.Union([
                Type.Object({
                    "coordinates": Type.Optional(Type.Array(Type.Array(Type.Tuple([Type.Number(), Type.Number()]), {"minItems":4})) /* external ref resolved: ../external/geojson/geometry.json#/definitions/polygon */),
                    "type": Type.Optional(Type.Literal("Polygon"))
                  }, {"title":"Polygon"}),
                Type.Object({
                    "coordinates": Type.Optional(Type.Array(Type.Array(Type.Array(Type.Tuple([Type.Number(), Type.Number()]), {"minItems":4})) /* external ref resolved: ../external/geojson/geometry.json#/definitions/polygon */)),
                    "type": Type.Optional(Type.Literal("MultiPolygon"))
                  }, {"title":"MultiPolygon"})
              ]),
              "id": Type.Optional(Type.Unknown()),
              "properties": Type.Union([Type.Object({}, {"description":"Additional data of any type"}), Type.Null()]),
              "type": Type.Optional(Type.Literal("Feature"))
            }, {"description":"A Geo JSON feature object which describes the regions boundary","title":"Feature"})),
          "geohash": Type.Optional(Type.Ref("signalk://schemas/definitions#Geohash")),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
        }, {"description":"A region of interest, each named with a UUID"}))),
    "routes": Type.Optional(Type.Record(Type.String({"pattern":"^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"}), Type.Object({
          "description": Type.Optional(Type.String({"description":"A description of the route"})),
          "distance": Type.Optional(Type.Number({"description":"Total distance from start to end"})),
          "end": Type.Optional(Type.String({"description":"The waypoint UUID at the end of the route"})),
          "feature": Type.Optional(Type.Object({
              "geometry": Type.Object({
                  "coordinates": Type.Optional(Type.Array(Type.Tuple([Type.Number(), Type.Number()]), {"minItems":2}) /* external ref resolved: ../external/geojson/geometry.json#/definitions/lineString */),
                  "type": Type.Optional(Type.Literal("LineString"))
                }, {"title":"LineString"}),
              "id": Type.Optional(Type.Unknown()),
              "properties": Type.Union([Type.Object({}, {"description":"Additional data of any type"}), Type.Null()]),
              "type": Type.Optional(Type.Literal("Feature"))
            }, {"description":"A Geo JSON feature object which describes the route between the waypoints","title":"Feature"})),
          "name": Type.Optional(Type.String({"description":"Route's common name","examples":["Nelson Harbour to Adele Is"]})),
          "source": Type.Optional(Type.Ref("signalk://schemas/definitions#Source")),
          "start": Type.Optional(Type.String({"description":"The waypoint UUID at the start of the route"})),
          "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp"))
        }, {"description":"A route, named with a UUID"}))),
    "waypoints": Type.Optional(Type.Record(Type.String({"pattern":"^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$"}), Type.Ref("signalk://schemas/definitions#Waypoint")))
  }, {"$id":"signalk://schemas/groups/resources","description":"Resources to aid in navigation and operation of the vessel","title":"resources"})
export type Resources = Type.Static<typeof ResourcesSchema>
