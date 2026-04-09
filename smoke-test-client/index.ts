/**
 * Purpose: Manual smoke-test harness that exercises the published library
 * against a live Signal K websocket stream.
 * Guidance: Keep this runtime-specific; avoid moving app wiring concerns into
 * src/lib so the package remains library-first.
 */
import WebSocket from 'ws'
import { parseDelta } from './transport.js'
import { createParserRuntime, type ParsedValue } from '../src/lib/index.js'

const WS_URL = 'ws://localhost:3000/signalk/v1/stream?subscribe=none&sendMeta=all'
const TARGET_PATHS = ['navigation.position', 'environment.wind.speedTrue', 'environment.wind.speedOverGround'] as const
const ANSI = { reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', white: '\x1b[37m' } as const

function sendSubscriptions(ws: WebSocket): void {
    ws.send(
        JSON.stringify({
            context: '*',
            unsubscribe: [{ path: '*' }]
        })
    )

    ws.send(
        JSON.stringify({
            context: 'vessels.self',
            sendMeta: 'all',
            subscribe: TARGET_PATHS.map((path) => ({
                path,
                period: 1000
            }))
        })
    )
}

const parser = createParserRuntime()

function colorize(color: string, message: string): string {
    return `${color}${message}${ANSI.reset}`
}

function logParsedValue(v: ParsedValue): void {
    if (v.validationStatus === 'valid') {
        console.log(colorize(ANSI.green, `[valid] ${v.valueType} at ${v.path}`))
        return
    }

    if (v.validationStatus === 'invalid') {
        const details = JSON.stringify(v.validationErrors, null, 2)
        console.error(colorize(ANSI.red, `[invalid] ${v.valueType} at ${v.path}\n${details}`))
        return
    }

    if (v.valueTypeStatus === 'unknown-value-type') {
        console.log(colorize(ANSI.yellow, `[unknown-value-type] ${v.valueType} at ${v.path}`))
        return
    }

    console.log(colorize(ANSI.white, `[no-value-type] ${v.path}`))
}

const ws = new WebSocket(WS_URL, {
    handshakeTimeout: 10000
})

ws.on('open', () => {
    sendSubscriptions(ws)
})

ws.on('message', (raw) => {
    const delta = parseDelta(raw)
    if (!delta) return

    const accepted = parser.processValues(delta)
    accepted.forEach(logParsedValue)
})

ws.on('close', (code, reasonBuffer) => {
    const reason = reasonBuffer.toString('utf8')
    console.warn(`[ws-close] code=${code} reason=${reason || '-'}`)
})

ws.on('error', (error) => {
    console.error('[ws-error]', error)
})
