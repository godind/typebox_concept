import WebSocket from 'ws'

import { MetaTypeMap, toAcceptedDeltaValues } from '../src/lib/parser.js'
import { TypesafeSkRouter } from './router.js'
import { isObject, type SkDelta } from '../src/lib/types.js'
import { createKnownSchemaValidators } from '../src/lib/validators.js'

const WS_URL = 'ws://localhost:3000/signalk/v1/stream?subscribe=none&sendMeta=all'
const TARGET_PATHS = ['navigation.position', 'environment.wind.speedOverGround'] as const

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
            subscribe: TARGET_PATHS.map((path) => ({ path }))
        })
    )
}

function parseDelta(raw: WebSocket.RawData): SkDelta | null {
    const text = raw.toString('utf8')
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
const validators = createKnownSchemaValidators()

router.onPath('navigation.position', (v) => {
    const prefix = v.validationStatus === 'validated'
        ? '[validated] Position'
        : '[accepted-unvalidated]'
    if (!isObject(v.value)) {
        console.log(`${prefix} navigation.position -> null`)
        return
    }

    const latitude = typeof v.value.latitude === 'number' ? v.value.latitude : null
    const longitude = typeof v.value.longitude === 'number' ? v.value.longitude : null
    console.log(`${prefix} navigation.position -> lat=${latitude ?? '-'} lon=${longitude ?? '-'}`)
})

router.onPath('environment.wind.speedOverGround', (v) => {
    const prefix = v.validationStatus === 'validated' ? '[validated]' : '[accepted-unvalidated]'
    const numeric = typeof v.value === 'number' ? v.value.toFixed(3) : '-'
    console.log(`${prefix} environment.wind.speedOverGround -> ${numeric}`)
})

const ws = new WebSocket(WS_URL, {
    handshakeTimeout: 10000
})

ws.on('open', () => {
    sendSubscriptions(ws)
})

ws.on('message', (raw) => {
    const delta = parseDelta(raw)
    if (!delta) return

    metaTypeMap.ingest(delta)
    const accepted = toAcceptedDeltaValues(delta, metaTypeMap, validators)
    router.emit(accepted)
})

ws.on('close', (code, reasonBuffer) => {
    const reason = reasonBuffer.toString('utf8')
    console.warn(`[ws-close] code=${code} reason=${reason || '-'}`)
})

ws.on('error', (error) => {
    console.error('[ws-error]', error)
})
