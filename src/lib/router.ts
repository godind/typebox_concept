import type { AcceptedDeltaValue } from './parser.js'

type AnyCallback = (value: AcceptedDeltaValue) => void

export class TypesafeSkRouter {
    private readonly pathHandlers = new Map<string, AnyCallback[]>()

    onPath(path: string, callback: AnyCallback): void {
        const list = this.pathHandlers.get(path) ?? []
        list.push(callback)
        this.pathHandlers.set(path, list)
    }

    emit(values: AcceptedDeltaValue[]): void {
        for (const value of values) {
            const pathList = this.pathHandlers.get(value.path)
            if (pathList) {
                for (const cb of pathList) cb(value)
            }
        }
    }
}
