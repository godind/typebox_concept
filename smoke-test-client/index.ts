/**
 * Purpose: Manual smoke-test harness that exercises the published library
 * against a live Signal K websocket stream.
 * Guidance: Keep this runtime-specific; avoid moving app wiring concerns into
 * src/lib so the package remains library-first.
 */
import WebSocket from 'ws'
import { TypesafeSkRouter } from './router.js'
import { isObject, parseDelta } from './transport.js'
import { createParserRuntime } from '../src/lib/index.js'

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

const router = new TypesafeSkRouter()
const parser = createParserRuntime()

function statusPrefix(v: { validationStatus: string; valueTypeStatus: string }): string {
    if (v.validationStatus === 'valid') return '[valid]'
    if (v.validationStatus === 'invalid') return '[invalid]'
    if (v.valueTypeStatus === 'unknown-value-type') return '[unknown-value-type]'
    return '[no-value-type]'
}

router.onPath('navigation.position', (v) => {
    const prefix = `${statusPrefix(v)} Position`
    if (!isObject(v.value)) {
        console.log(`${prefix} navigation.position -> null`)
        return
    }

    const latitude = typeof v.value.latitude === 'number' ? v.value.latitude : null
    const longitude = typeof v.value.longitude === 'number' ? v.value.longitude : null
    console.log(`${prefix} navigation.position -> lat=${latitude ?? '-'} lon=${longitude ?? '-'}`)
})

router.onPath('environment.wind.speedOverGround', (v) => {
    const prefix = statusPrefix(v)
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

    const accepted = parser.processValues(delta)
    router.emit(accepted)
})

ws.on('close', (code, reasonBuffer) => {
    const reason = reasonBuffer.toString('utf8')
    console.warn(`[ws-close] code=${code} reason=${reason || '-'}`)
})

ws.on('error', (error) => {
    console.error('[ws-error]', error)
})
