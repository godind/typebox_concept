// Generated from converter/app/processors/format-mapping-registry.mjs - do not edit manually
import Format from 'typebox/format'

let _registered = false

export function registerRuntimeFormats(): void {
  if (_registered) return
  Format.Set("date-time", (value) => typeof value === 'string' && new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)((-(\\d{2}):(\\d{2})|Z)?)$").test(value))
  Format.Set("signalk-vessel-mmsi", (value) => typeof value === 'string' && new RegExp("^[2-7][0-9]{8}$").test(value))
  Format.Set("signalk-aircraft-mmsi", (value) => typeof value === 'string' && new RegExp("^1[0-9]{8}$").test(value))
  Format.Set("signalk-aton-mmsi", (value) => typeof value === 'string' && new RegExp("^99[0-9]{7}$").test(value))
  Format.Set("signalk-sar-mmsi", (value) => typeof value === 'string' && new RegExp("^97[0-9]{7}$").test(value))
  Format.Set("signalk-source-ref", (value) => typeof value === 'string' && new RegExp("^[A-Za-z0-9-_.]*$").test(value))
  Format.Set("signalk-geohash", (value) => typeof value === 'string' && new RegExp("^[0-9A-Za-z:]{1,}$").test(value))
  Format.Set("signalk-uuid-urn", (value) => typeof value === 'string' && new RegExp("^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$").test(value))
  Format.Set("signalk-version", (value) => typeof value === 'string' && new RegExp("^[0-9]{1,3}[.][0-9]{1,2}[.][0-9]{1,2}($|-[a-zA-Z0-9]+$)").test(value))
  Format.Set("signalk-self-vessel-id", (value) => typeof value === 'string' && new RegExp("^vessels.(urn:mrn:(imo:mmsi:[2-7][0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$").test(value))
  Format.Set("signalk-self-aircraft-id", (value) => typeof value === 'string' && new RegExp("^aircraft.(urn:mrn:(imo:mmsi:1[0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$").test(value))
  Format.Set("signalk-self-aton-id", (value) => typeof value === 'string' && new RegExp("^aton.(urn:mrn:(imo:mmsi:99[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$").test(value))
  Format.Set("signalk-self-sar-id", (value) => typeof value === 'string' && new RegExp("^sar.(urn:mrn:(imo:mmsi:97[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$").test(value))
  Format.Set("signalk-request-id", (value) => typeof value === 'string' && new RegExp("[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}").test(value))
  Format.Set("signalk-imo-number", (value) => typeof value === 'string' && new RegExp("^IMO [0-9]{7,7}$").test(value))
  _registered = true
}
