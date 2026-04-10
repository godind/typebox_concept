import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { createParserRuntime } from '../../src/lib/index.js'
import type { SkDelta } from '../../src/lib/types.js'

test('processValues parses a realistic Signal K fixture end to end', () => {
  const fixturePath = new URL('../fixtures/signalk-library/realistic-mixed-delta.json', import.meta.url)
  const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as SkDelta

  const runtime = createParserRuntime()
  const parsed = runtime.processValues(fixture)

  assert.equal(parsed.length, 4)
  assert.deepEqual(parsed[0], {
    context: 'vessels.urn:mrn:imo:mmsi:123456789',
    $source: 'test-suite.demo',
    path: 'navigation.position',
    timestamp: '2026-04-09T12:00:01.000Z',
    source: undefined,
    schemaName: 'Position',
    valueType: 'Position',
    schemaTypeStatus: 'known-schema-type',
    validationStatus: 'valid',
    value: {
      latitude: 48.8584,
      longitude: 2.2945
    }
  })
  assert.deepEqual(parsed[1], {
    context: 'vessels.urn:mrn:imo:mmsi:123456789',
    $source: 'test-suite.demo',
    path: 'environment.depth.belowTransducer',
    timestamp: '2026-04-09T12:00:01.000Z',
    source: undefined,
    schemaName: 'Numeric',
    valueType: 'Numeric',
    schemaTypeStatus: 'known-schema-type',
    validationStatus: 'valid',
    value: null
  })
  assert.deepEqual(parsed[2], {
    context: 'vessels.urn:mrn:imo:mmsi:123456789',
    $source: 'test-suite.demo',
    path: 'navigation.magneticVariation',
    timestamp: '2026-04-09T12:00:01.000Z',
    source: undefined,
    value: 0.07,
    valueType: 'Angle',
    schemaTypeStatus: 'unknown-schema-type',
    validationStatus: 'not-validated'
  })
  assert.deepEqual(parsed[3], {
    context: 'vessels.urn:mrn:imo:mmsi:123456789',
    $source: 'test-suite.demo',
    path: 'navigation.speedOverGround',
    timestamp: '2026-04-09T12:00:01.000Z',
    source: undefined,
    value: 4.3,
    schemaTypeStatus: 'no-schema-type',
    validationStatus: 'not-validated'
  })
})