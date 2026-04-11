/**
 * Purpose: Own websocket boundary parsing for the smoke-test client.
 * Guidance: Keep transport guards local to the client so library internals can
 * evolve without forcing downstream runtime parsing contracts.
 */
import type WebSocket from 'ws'
import { Compile } from 'typebox/schema'
import { createSchemaValidators } from '@signalk/types/runtime'
import {
  DiscoverySchema,
  DeltaSchema,
  HelloSchema,
  SourceRefSchema,
  SourceSchema,
  TimestampSchema,
  type Delta,
  type Discovery,
  type Hello
} from '@signalk/types/transport'
import {
  AlarmMethodEnumSchema,
  AlarmStateSchema,
  MetaSchema
} from '@signalk/types/meta'
import { UrlSchema, VersionSchema } from '@signalk/types/identity'

export type TransportMessage =
  | { kind: 'delta'; message: Delta }
  | { kind: 'hello'; message: Hello }
  | { kind: 'discovery'; message: Discovery }

// Public runtime entrypoint: compiling validators once ensures custom formats are registered.
createSchemaValidators()

const SCHEMA_REFS = {
  'signalk://schemas/definitions#AlarmMethodEnum': AlarmMethodEnumSchema,
  'signalk://schemas/definitions#AlarmState': AlarmStateSchema,
  'signalk://schemas/definitions#Meta': MetaSchema,
  'signalk://schemas/definitions#SourceRef': SourceRefSchema,
  'signalk://schemas/definitions#Source': SourceSchema,
  'signalk://schemas/definitions#Timestamp': TimestampSchema,
  'signalk://schemas/definitions#Url': UrlSchema,
  'signalk://schemas/definitions#Version': VersionSchema
}

const DELTA_VALIDATOR = Compile(SCHEMA_REFS, DeltaSchema)
const HELLO_VALIDATOR = Compile(SCHEMA_REFS, HelloSchema)
const DISCOVERY_VALIDATOR = Compile(SCHEMA_REFS, DiscoverySchema)

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

function isDeltaMessage(v: unknown): v is Delta {
  return DELTA_VALIDATOR.Check(v)
}

function isHelloMessage(v: unknown): v is Hello {
  return HELLO_VALIDATOR.Check(v)
}

function isDiscoveryMessage(v: unknown): v is Discovery {
  if (!isObject(v)) return false
  const hasDiscoveryFields = 'server' in v || 'endpoints' in v
  return hasDiscoveryFields && DISCOVERY_VALIDATOR.Check(v)
}

function formatValidationErrors(errors: unknown[], max = 5): string {
  const clipped = errors.slice(0, max)
  return JSON.stringify(clipped, null, 2)
}

function previewPayload(text: string, max = 800): string {
  return text.length <= max ? text : `${text.slice(0, max)}...<truncated>`
}

export function parseTransportMessage(raw: WebSocket.RawData): TransportMessage | null {
  const text = raw.toString('utf8')
  try {
    const parsed = JSON.parse(text) as unknown
    if (isDeltaMessage(parsed)) return { kind: 'delta', message: parsed }
    if (isHelloMessage(parsed)) return { kind: 'hello', message: parsed }
    if (isDiscoveryMessage(parsed)) return { kind: 'discovery', message: parsed }

    const deltaErrors = [...DELTA_VALIDATOR.Errors(parsed)]
    const helloErrors = [...HELLO_VALIDATOR.Errors(parsed)]
    const discoveryErrors = [...DISCOVERY_VALIDATOR.Errors(parsed)]

    console.warn('[transport-unmatched] websocket frame failed Delta/Hello/Discovery schema checks')
    console.warn(`[transport-unmatched] payload=${previewPayload(text)}`)
    console.warn('[transport-unmatched] delta-errors=', formatValidationErrors(deltaErrors))
    console.warn('[transport-unmatched] hello-errors=', formatValidationErrors(helloErrors))
    console.warn('[transport-unmatched] discovery-errors=', formatValidationErrors(discoveryErrors))
    return null
  } catch (error) {
    console.error('[json-error] unable to parse message', error)
    return null
  }
}
