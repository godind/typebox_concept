/**
 * Purpose: Dispatch accepted delta values to path-based callbacks for the
 * smoke-test client runtime.
 * Guidance: Keep routing concerns in smoke-test-client unless a stable,
 * reusable routing API is intentionally promoted into src/lib.
 */
import type { ParsedDeltaValue } from '../src/lib/parser.js'

type AnyCallback = (value: ParsedDeltaValue) => void

export class TypesafeSkRouter {
    private readonly pathHandlers = new Map<string, AnyCallback[]>()

    onPath(path: string, callback: AnyCallback): void {
        const list = this.pathHandlers.get(path) ?? []
        list.push(callback)
        this.pathHandlers.set(path, list)
    }

    emit(values: ParsedDeltaValue[]): void {
        for (const value of values) {
            const pathList = this.pathHandlers.get(value.path)
            if (pathList) {
                for (const cb of pathList) cb(value)
            }
        }
    }
}
