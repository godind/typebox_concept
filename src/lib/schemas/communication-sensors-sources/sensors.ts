// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/sensors.json
import { Type } from 'typebox'

export const SensorsSchema = Type.Object({
    "class": Type.Optional(Type.Ref("signalk://schemas/definitions#StringValue")),
    "fromBow": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "fromCenter": Type.Optional(Type.Ref("signalk://schemas/definitions#NumberValue")),
    "name": Type.Optional(Type.String({"description":"The common name of the sensor"})),
    "sensorData": Type.Optional(Type.String({"description":"The data of the sensor data. FIXME - need to ref the definitions of sensor types"})),
    "sensorType": Type.Optional(Type.String({"description":"The datamodel definition of the sensor data. FIXME - need to create a definitions lib of sensor datamodel types"}))
  }, {"$id":"signalk://schemas/groups/sensors","description":"An object describing an individual sensor. It should be an object in vessel, named using a unique name or UUID","title":"sensor"})
export type Sensors = Type.Static<typeof SensorsSchema>
