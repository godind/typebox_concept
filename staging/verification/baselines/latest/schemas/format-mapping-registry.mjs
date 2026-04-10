/**
 * Shared Phase 3.1b format mapping registry.
 * Adds deterministic TypeBox format names for known Signal K string patterns.
 */

export const FORMAT_RULES = [
  {
    id: 'mmsi-vessel',
    format: 'signalk-vessel-mmsi',
    match: { kind: 'exact-pattern', value: '^[2-7][0-9]{8}$' },
    runtimeRegex: '^[2-7][0-9]{8}$'
  },
  {
    id: 'mmsi-aircraft',
    format: 'signalk-aircraft-mmsi',
    match: { kind: 'exact-pattern', value: '^1[0-9]{8}$' },
    runtimeRegex: '^1[0-9]{8}$'
  },
  {
    id: 'mmsi-aton',
    format: 'signalk-aton-mmsi',
    match: { kind: 'exact-pattern', value: '^99[0-9]{7}$' },
    runtimeRegex: '^99[0-9]{7}$'
  },
  {
    id: 'mmsi-sar',
    format: 'signalk-sar-mmsi',
    match: { kind: 'exact-pattern', value: '^97[0-9]{7}$' },
    runtimeRegex: '^97[0-9]{7}$'
  },
  {
    id: 'source-ref',
    format: 'signalk-source-ref',
    match: { kind: 'exact-pattern', value: '^[A-Za-z0-9-_.]*$' },
    runtimeRegex: '^[A-Za-z0-9-_.]*$'
  },
  {
    id: 'geohash',
    format: 'signalk-geohash',
    match: { kind: 'exact-pattern', value: '^[0-9A-Za-z:]{1,}$' },
    runtimeRegex: '^[0-9A-Za-z:]{1,}$'
  },
  {
    id: 'uuid-urn',
    format: 'signalk-uuid-urn',
    match: { kind: 'exact-pattern', value: '^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$' },
    runtimeRegex: '^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$'
  },
  {
    id: 'version-semver-like',
    format: 'signalk-version',
    match: { kind: 'exact-pattern', value: '^[0-9]{1,3}[.][0-9]{1,2}[.][0-9]{1,2}($|-[a-zA-Z0-9]+$)' },
    runtimeRegex: '^[0-9]{1,3}[.][0-9]{1,2}[.][0-9]{1,2}($|-[a-zA-Z0-9]+$)'
  },
  {
    id: 'hello-self-vessel',
    format: 'signalk-self-vessel-id',
    match: { kind: 'exact-pattern', value: '^vessels.(urn:mrn:(imo:mmsi:[2-7][0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$' },
    runtimeRegex: '^vessels.(urn:mrn:(imo:mmsi:[2-7][0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$'
  },
  {
    id: 'hello-self-aircraft',
    format: 'signalk-self-aircraft-id',
    match: { kind: 'exact-pattern', value: '^aircraft.(urn:mrn:(imo:mmsi:1[0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$' },
    runtimeRegex: '^aircraft.(urn:mrn:(imo:mmsi:1[0-9]{8}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$'
  },
  {
    id: 'hello-self-aton',
    format: 'signalk-self-aton-id',
    match: { kind: 'exact-pattern', value: '^aton.(urn:mrn:(imo:mmsi:99[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$' },
    runtimeRegex: '^aton.(urn:mrn:(imo:mmsi:99[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$'
  },
  {
    id: 'hello-self-sar',
    format: 'signalk-self-sar-id',
    match: { kind: 'exact-pattern', value: '^sar.(urn:mrn:(imo:mmsi:97[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$' },
    runtimeRegex: '^sar.(urn:mrn:(imo:mmsi:97[0-9]{7}$|signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$))|(http(s?):.*|mailto:.*|tel:(\\+?)[0-9]{4,})$'
  },
  // Curated semantic rules added after full-spec audit (April 2026).
  // Patterns .*Z$ and ^[a-zA-Z0-9/+-]+$ intentionally left unmapped:
  //   .*Z$ is already paired with upstream format:date-time; redundant format label adds no routing value.
  //   ^[a-zA-Z0-9/+-]+$ is a generic timezone region string; pattern enforcement is sufficient.
  {
    id: 'request-id',
    format: 'signalk-request-id',
    // Plain UUID (no MRN prefix) used for requestId in auth/request-response messages.
    match: { kind: 'exact-pattern', value: '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}' },
    runtimeRegex: '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}'
  },
  {
    id: 'imo-number',
    format: 'signalk-imo-number',
    // IMO vessel registration number: "IMO " prefix followed by exactly 7 digits.
    match: { kind: 'exact-pattern', value: '^IMO [0-9]{7,7}$' },
    runtimeRegex: '^IMO [0-9]{7,7}$'
  }
]

function matchesRule(rule, schema) {
  if (rule.match.kind === 'exact-pattern') return schema.pattern === rule.match.value
  return false
}

export function createFormatTrace() {
  return {
    applied: [],
    unmapped: [],
    _appliedKeys: new Set(),
    _unmappedKeys: new Set()
  }
}

export function applyFormatMapping(schema, location, trace) {
  if (!schema || typeof schema !== 'object') return undefined
  if (schema.format !== undefined) return undefined
  if (typeof schema.pattern !== 'string') return undefined

  for (const rule of FORMAT_RULES) {
    if (!matchesRule(rule, schema)) continue

    const key = `${location}|${rule.format}`
    if (!trace._appliedKeys.has(key)) {
      trace._appliedKeys.add(key)
      trace.applied.push({
        location,
        format: rule.format,
        rule: rule.id,
        pattern: schema.pattern
      })
    }
    return rule.format
  }

  const unknownKey = `${location}|${schema.pattern}`
  if (!trace._unmappedKeys.has(unknownKey)) {
    trace._unmappedKeys.add(unknownKey)
    trace.unmapped.push({
      location,
      pattern: schema.pattern
    })
  }

  return undefined
}
