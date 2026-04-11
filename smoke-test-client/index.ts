/**
 * Purpose: Manual smoke-test harness that exercises the published library
 * against a live Signal K websocket stream.
 * Guidance: Keep this runtime-specific; avoid moving app wiring concerns into
 * src/lib so the package remains library-first.
 */
import WebSocket from 'ws'
import { parseTransportMessage } from './transport.js'
import { createParserRuntime, type ParsedValue } from '@signalk/types/runtime'

const ANSI = { reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', white: '\x1b[37m' } as const

const WS_URL = 'ws://localhost:3000/signalk/v1/stream?subscribe=none&sendMeta=all'
//const TARGET_PATHS = ['*']
const TARGET_PATHS = ['navigation.position', 'environment.wind.speedTrue', 'environment.wind.speedOverGround'] as const
const UPDATE_INTERVAL = 1000

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
                period: UPDATE_INTERVAL
            }))
        })
    )
}

const parser = createParserRuntime()

function colorize(color: string, message: string): string {
    return `${color}${message}${ANSI.reset}`
}

function formatType(v: ParsedValue): string {
    return typeof v.valueType === 'string' ? v.valueType : '<missing>'
}

function logDiscoveryMessage(discovery: { server?: { id?: string; version?: string }; endpoints?: Record<string, unknown> }): void {
    const serverId = discovery.server?.id ?? '<unknown-server>'
    const serverVersion = discovery.server?.version ?? '<unknown-version>'
    const endpointGroups = discovery.endpoints ? Object.keys(discovery.endpoints) : []
    const endpointSummary = endpointGroups.length > 0 ? endpointGroups.join(', ') : '<none>'
    console.log(`[discovery] server=${serverId} version=${serverVersion} endpoint-groups=${endpointSummary}`)
}

function logParsedValue(v: ParsedValue): void {
    if (v.validationStatus === 'valid') {
        console.log(colorize(ANSI.green, `[valid] type=${formatType(v)} path=${v.path}`))
        return
    }

    if (v.validationStatus === 'invalid') {
        const details = JSON.stringify(v.validationErrors, null, 2)
        console.error(colorize(ANSI.red, `[invalid] type=${formatType(v)} path=${v.path}\n${details}`))
        return
    }

    if (v.schemaTypeStatus === 'unknown-schema-type') {
        console.log(colorize(ANSI.yellow, `[unknown-schema-type] type=${formatType(v)} path=${v.path}`))
        return
    }

    console.log(colorize(ANSI.white, `[no-schema-type] type=${formatType(v)} path=${v.path}`))
}

const ws = new WebSocket(WS_URL, {
    handshakeTimeout: 10000
})

ws.on('open', () => {
    sendSubscriptions(ws)
})

ws.on('message', (raw) => {
    const parsed = parseTransportMessage(raw)
    if (!parsed) return

    if (parsed.kind === 'delta') {
        const accepted = parser.processValues(parsed.message)
        accepted.forEach(logParsedValue)
        return
    }

    if (parsed.kind === 'hello') {
        console.log(`[hello] version=${parsed.message.version}`)
        return
    }

    logDiscoveryMessage(parsed.message)
})

ws.on('close', (code, reasonBuffer) => {
    const reason = reasonBuffer.toString('utf8')
    console.warn(`[ws-close] code=${code} reason=${reason || '-'}`)
})

ws.on('error', (error) => {
    console.error('[ws-error]', error)
})
