import assert from 'node:assert/strict'
import test from 'node:test'

import { Compile } from 'typebox/schema'
import { Type } from 'typebox'

import { createSchemaValidators } from '../../src/lib/validators.js'
import { registerRuntimeFormats } from '../../src/lib/formaters.js'

test('registerRuntimeFormats enforces generated custom formats', () => {
  registerRuntimeFormats()

  const uuidValidator = Compile(Type.String({ format: 'signalk-uuid-urn' }))
  assert.equal(uuidValidator.Check('urn:mrn:signalk:uuid:b7590868-1d62-47d9-989c-32321b349fb9'), true)
  assert.equal(uuidValidator.Check('urn:mrn:signalk:uuid:not-a-uuid'), false)

  const versionValidator = Compile(Type.String({ format: 'signalk-version' }))
  assert.equal(versionValidator.Check('1.5.0'), true)
  assert.equal(versionValidator.Check('v1.5.0'), false)

  const selfValidator = Compile(Type.String({ format: 'signalk-self-vessel-id' }))
  assert.equal(selfValidator.Check('vessels.http://localhost:3000'), true)
  assert.equal(selfValidator.Check('invalid-self-value'), false)
})

test('createSchemaValidators bootstrap keeps runtime format registration available', () => {
  createSchemaValidators()

  const validator = Compile(Type.String({ format: 'signalk-source-ref' }))
  assert.equal(validator.Check('NMEA0183.COM1.GP'), true)
  assert.equal(validator.Check('BAD SOURCE REF!'), false)
})
