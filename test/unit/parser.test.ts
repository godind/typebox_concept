import assert from 'node:assert/strict'
import test from 'node:test'

import { createParserRuntime } from '../../src/lib/index.js'

// --- ValidatedValue (Position) ---

test('validateValues emits ValidatedValue for a valid Position', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'navigation.position', value: { type: 'Position' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        timestamp: '2026-04-08T00:00:00.000Z',
        values: [
          {
            path: 'navigation.position',
            value: { latitude: 37.7749, longitude: -122.4194 }
          }
        ]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.deepEqual(parsed[0], {
    context: 'vessels.self',
    $source: 'test-source',
    path: 'navigation.position',
    timestamp: '2026-04-08T00:00:00.000Z',
    source: undefined,
    schemaName: 'Position',
    valueType: 'Position',
    valueTypeStatus: 'known-value-type',
    validationStatus: 'valid',
    value: { latitude: 37.7749, longitude: -122.4194 }
  })
})

// --- InvalidValue (Position) ---

test('validateValues emits InvalidValue with validationErrors for an invalid Position', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'navigation.position', value: { type: 'Position' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [
          {
            path: 'navigation.position',
            value: { latitude: 123, longitude: -122.4194 }
          }
        ]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  const result = parsed[0]
  assert.equal(result?.validationStatus, 'invalid')
  assert.equal(result?.valueTypeStatus, 'known-value-type')
  assert.equal(result?.valueType, 'Position')
  assert.equal(result?.schemaName, 'Position')
  assert.deepEqual(result?.value, { latitude: 123, longitude: -122.4194 })
  assert.ok(result && 'validationErrors' in result)
  assert.ok(result.validationErrors.length > 0)
})

// --- ValidatedValue (Numeric) ---

test('validateValues emits ValidatedValue for a valid Numeric', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'environment.depth.belowTransducer', value: { type: 'Numeric' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [{ path: 'environment.depth.belowTransducer', value: 12.4 }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.equal(parsed[0]?.validationStatus, 'valid')
  assert.equal(parsed[0]?.schemaName, 'Numeric')
  assert.equal(parsed[0]?.valueType, 'Numeric')
  assert.equal(parsed[0]?.value, 12.4)
})

// --- NoSchemaTypeValue ---

test('validateValues emits NoSchemaTypeValue when no meta.type has been indexed for the path', () => {
  const runtime = createParserRuntime()

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        timestamp: '2026-04-08T00:00:00.000Z',
        values: [{ path: 'navigation.speedOverGround', value: 3.5 }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.deepEqual(parsed[0], {
    context: 'vessels.self',
    $source: 'test-source',
    path: 'navigation.speedOverGround',
    timestamp: '2026-04-08T00:00:00.000Z',
    source: undefined,
    value: 3.5,
    valueTypeStatus: 'no-value-type',
    validationStatus: 'not-validated'
  })
})

// --- UnknownSchemaTypeValue ---

test('validateValues emits UnknownSchemaTypeValue when indexed meta.type is not a known schema', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'navigation.magneticVariation', value: { type: 'SomeUnrecognisedType' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [{ path: 'navigation.magneticVariation', value: 0.12 }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.deepEqual(parsed[0], {
    context: 'vessels.self',
    $source: 'test-source',
    path: 'navigation.magneticVariation',
    source: undefined,
    value: 0.12,
    valueType: 'SomeUnrecognisedType',
    valueTypeStatus: 'unknown-value-type',
    validationStatus: 'not-validated'
  })
})

// --- null as valid value for nullable schemas ---

test('validateValues emits ValidatedValue for null Numeric', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'environment.depth.belowTransducer', value: { type: 'Numeric' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [{ path: 'environment.depth.belowTransducer', value: null }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.equal(parsed[0]?.validationStatus, 'valid')
  assert.equal(parsed[0]?.schemaName, 'Numeric')
  assert.equal(parsed[0]?.value, null)
})

test('validateValues emits ValidatedValue for null Position', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'navigation.position', value: { type: 'Position' } }]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [{ path: 'navigation.position', value: null }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.equal(parsed[0]?.validationStatus, 'valid')
  assert.equal(parsed[0]?.schemaName, 'Position')
  assert.equal(parsed[0]?.value, null)
})

// --- multiple values in a single delta ---

test('validateValues emits a result for every value entry in a single delta', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [
          { path: 'environment.depth.belowTransducer', value: { type: 'Numeric' } },
          { path: 'navigation.position', value: { type: 'Position' } },
          { path: 'navigation.magneticVariation', value: { type: 'SomeUnrecognisedType' } }
        ]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        values: [
          { path: 'environment.depth.belowTransducer', value: 8.1 },
          { path: 'navigation.position', value: { latitude: 37.7749, longitude: -122.4194 } },
          { path: 'navigation.magneticVariation', value: 0.05 },
          { path: 'navigation.speedOverGround', value: 2.0 }
        ]
      }
    ]
  })

  assert.equal(parsed.length, 4)
  assert.equal(parsed[0]?.validationStatus, 'valid')
  assert.equal(parsed[0]?.schemaName, 'Numeric')
  assert.equal(parsed[1]?.validationStatus, 'valid')
  assert.equal(parsed[1]?.schemaName, 'Position')
  assert.equal(parsed[2]?.valueTypeStatus, 'unknown-value-type')
  assert.equal(parsed[2]?.valueType, 'SomeUnrecognisedType')
  assert.equal(parsed[3]?.valueTypeStatus, 'no-value-type')
})

// --- malformed transport payload tolerance ---

test('validateValues skips malformed and partial transport entries while preserving valid ones', () => {
  const runtime = createParserRuntime()

  runtime.indexSchemaTypes({
    context: null,
    updates: [
      null,
      {
        meta: 'not-an-array'
      },
      {
        meta: [
          {},
          { path: 42, value: { type: 'Numeric' } },
          { path: 'environment.depth.belowTransducer', value: {} },
          { path: 'environment.depth.belowTransducer', value: { type: 'Numeric' } }
        ]
      }
    ]
  })

  const parsed = runtime.validateValues({
    context: null,
    updates: [
      {
        values: [
          null,
          {},
          { path: 42, value: 99 },
          { path: 'environment.depth.belowTransducer', value: 9.8 },
          { path: 'navigation.speedOverGround', value: 2.7 }
        ]
      }
    ]
  })

  assert.equal(parsed.length, 2)
  assert.deepEqual(parsed[0], {
    context: 'vessels.self',
    $source: 'unknown-source',
    path: 'environment.depth.belowTransducer',
    source: undefined,
    schemaName: 'Numeric',
    valueType: 'Numeric',
    valueTypeStatus: 'known-value-type',
    validationStatus: 'valid',
    value: 9.8
  })
  assert.deepEqual(parsed[1], {
    context: 'vessels.self',
    $source: 'unknown-source',
    path: 'navigation.speedOverGround',
    source: undefined,
    value: 2.7,
    valueTypeStatus: 'no-value-type',
    validationStatus: 'not-validated'
  })
})

// --- processValues delegation ---

test('processValues indexes meta.type and validates values in a single call', () => {
  const runtime = createParserRuntime()

  const parsed = runtime.processValues({
    context: 'vessels.self',
    updates: [
      {
        $source: 'test-source',
        meta: [{ path: 'environment.depth.belowTransducer', value: { type: 'Numeric' } }],
        values: [{ path: 'environment.depth.belowTransducer', value: 5.0 }]
      }
    ]
  })

  assert.equal(parsed.length, 1)
  assert.equal(parsed[0]?.validationStatus, 'valid')
  assert.equal(parsed[0]?.schemaName, 'Numeric')
  assert.equal(parsed[0]?.value, 5.0)
})