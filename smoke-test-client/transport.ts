/**
 * Purpose: Own websocket boundary parsing for the smoke-test client.
 * Guidance: Keep transport guards local to the client so library internals can
 * evolve without forcing downstream runtime parsing contracts.
 */
import type WebSocket from 'ws'

export interface SmokeSkDelta {
  context?: unknown
  updates?: unknown
}

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

export function parseDelta(raw: WebSocket.RawData): SmokeSkDelta | null {
  const text = raw.toString('utf8')
  try {
    const parsed = JSON.parse(text) as unknown
    return isObject(parsed) ? (parsed as SmokeSkDelta) : null
  } catch (error) {
    console.error('[json-error] unable to parse message', error)
    return null
  }
}
