import WebSocket from 'ws'

import { MetaTypeMap, toAcceptedDeltaValues } from './normalizer.js'
import { TypesafeSkRouter } from './router.js'
import { isObject, type SkDelta } from './types.js'

const WS_URL = 'ws://localhost:3000/signalk/v1/stream?subscribe=none&sendMeta=all'
const TARGET_PATHS = ['navigation.position', 'environment.wind.speedOverGround'] as const
const CONNECT_TIMEOUT_MS = 10000
const ENABLE_WS_DEBUG = false

const stateName = (state: number): string => {
    switch (state) {
        case WebSocket.CONNECTING:
            return 'CONNECTING'
        case WebSocket.OPEN:
            return 'OPEN'
        case WebSocket.CLOSING:
            return 'CLOSING'
        case WebSocket.CLOSED:
            return 'CLOSED'
        default:
            return `UNKNOWN(${state})`
    }
}

const validationPrefix = (
    status: 'validated' | 'accepted-unvalidated',
    schemaName?: string
): string => {
    if (status === 'validated' && schemaName) {
        return `[validated] ${schemaName}`
    }

    return `[${status}]`
}

const logWs = (message: string, extra?: unknown): void => {
    if (!ENABLE_WS_DEBUG) {
        return
    }

    if (extra === undefined) {
        console.log(`[ws] ${message}`)
        return
    }

    console.log(`[ws] ${message}`, extra)
}

const rawDataBytes = (raw: WebSocket.RawData): number => {
    if (Array.isArray(raw)) {
        return raw.reduce((sum, chunk) => sum + chunk.byteLength, 0)
    }
    return raw.byteLength
}

function sendSubscriptions(ws: WebSocket): void {
    logWs('sending unsubscribe-all')
    ws.send(
        JSON.stringify({
            context: '*',
            unsubscribe: [{ path: '*' }]
        })
    )

    logWs('sending subscribe request', {
        context: 'vessels.self',
        paths: TARGET_PATHS
    })
    ws.send(
        JSON.stringify({
            context: 'vessels.self',
            sendMeta: 'all',
            subscribe: TARGET_PATHS.map((path) => ({ path }))
        })
    )
}

function parseDelta(raw: WebSocket.RawData): SkDelta | null {
    const text = typeof raw === 'string' ? raw : raw.toString('utf8')
    try {
        const parsed = JSON.parse(text) as unknown
        return isObject(parsed) ? (parsed as SkDelta) : null
    } catch (error) {
        console.error('[json-error] unable to parse message', error)
        return null
    }
}

const metaTypeMap = new MetaTypeMap()
const router = new TypesafeSkRouter()

router.onPath('navigation.position', (v) => {
    const prefix = validationPrefix(v.validationStatus, 'Position')
    if (!isObject(v.value)) {
        console.log(`${prefix} navigation.position -> null`)
        return
    }

    const latitude = typeof v.value.latitude === 'number' ? v.value.latitude : null
    const longitude = typeof v.value.longitude === 'number' ? v.value.longitude : null
    console.log(`${prefix} navigation.position -> lat=${latitude ?? '-'} lon=${longitude ?? '-'}`)
})

router.onPath('environment.wind.speedOverGround', (v) => {
    const prefix = validationPrefix(v.validationStatus)
    const numeric = typeof v.value === 'number' ? v.value.toFixed(3) : '-'
    console.log(`${prefix} environment.wind.speedOverGround -> ${numeric}`)
})

logWs(`creating websocket client -> ${WS_URL}`)
const ws = new WebSocket(WS_URL, {
    handshakeTimeout: CONNECT_TIMEOUT_MS
})

const connectWatchdog = setTimeout(() => {
    logWs(`connect timeout after ${CONNECT_TIMEOUT_MS}ms`, {
        readyState: stateName(ws.readyState),
        bufferedAmount: ws.bufferedAmount,
        url: ws.url
    })
}, CONNECT_TIMEOUT_MS + 1000)

ws.on('upgrade', (response) => {
    logWs('upgrade response received', {
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        headers: response.headers
    })
})

ws.on('unexpected-response', (_, response) => {
    logWs('unexpected HTTP response during websocket handshake', {
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        headers: response.headers
    })
})

ws.on('open', () => {
    clearTimeout(connectWatchdog)
    logWs(`open -> connected to ${WS_URL}`)
    logWs('open state snapshot', {
        readyState: stateName(ws.readyState),
        protocol: ws.protocol,
        bufferedAmount: ws.bufferedAmount,
        url: ws.url
    })

    const socket = (ws as unknown as { _socket?: { remoteAddress?: string; remotePort?: number; localAddress?: string; localPort?: number } })._socket
    if (socket) {
        logWs('tcp socket details', {
            localAddress: socket.localAddress,
            localPort: socket.localPort,
            remoteAddress: socket.remoteAddress,
            remotePort: socket.remotePort
        })
    }

    sendSubscriptions(ws)
    logWs('subscribe flow completed')
})

ws.on('message', (raw) => {
    const bytes = rawDataBytes(raw)
    logWs(`message received (${bytes} bytes)`)

    const delta = parseDelta(raw)
    if (!delta) return

    metaTypeMap.ingest(delta)
    const accepted = toAcceptedDeltaValues(delta, metaTypeMap)
    if (accepted.length > 0) {
        router.emit(accepted)
    }
})

ws.on('close', (code, reasonBuffer) => {
    clearTimeout(connectWatchdog)
    const reason = reasonBuffer.toString('utf8')
    logWs('close event', {
        code,
        reason: reason || '-',
        readyState: stateName(ws.readyState),
        bufferedAmount: ws.bufferedAmount
    })
})

ws.on('error', (error) => {
    clearTimeout(connectWatchdog)
    logWs('error event', {
        name: error.name,
        message: error.message,
        stack: error.stack
    })
})

ws.on('ping', (data) => {
    logWs(`ping received (${data.length} bytes)`)
})

ws.on('pong', (data) => {
    logWs(`pong received (${data.length} bytes)`)
})
