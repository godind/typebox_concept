import type { AcceptedDeltaValue, KnownValidatedDelta, ValidationStatus } from './normalizer.js'
import type { KnownSchemaName } from './schemas.js'

type KnownSchemaCallback<K extends KnownSchemaName> = (xvalue: Extract<KnownValidatedDelta, { schemaName: K }>) => void
type AnyCallback = (value: AcceptedDeltaValue) => void
type StatusCallback = (value: Extract<AcceptedDeltaValue, { validationStatus: ValidationStatus }>) => void

export class TypesafeSkRouter {
    private readonly pathHandlers = new Map<string, AnyCallback[]>()
    private readonly schemaHandlers = new Map<KnownSchemaName, Array<(value: KnownValidatedDelta) => void>>()
    private readonly statusHandlers = new Map<ValidationStatus, StatusCallback[]>()

    onPath(path: string, callback: AnyCallback): void {
        const list = this.pathHandlers.get(path) ?? []
        list.push(callback)
        this.pathHandlers.set(path, list)
    }

    onSchema<K extends KnownSchemaName>(schemaName: K, callback: KnownSchemaCallback<K>): void {
        const list = this.schemaHandlers.get(schemaName) ?? []
        list.push(callback as (value: KnownValidatedDelta) => void)
        this.schemaHandlers.set(schemaName, list)
    }

    onStatus(status: ValidationStatus, callback: StatusCallback): void {
        const list = this.statusHandlers.get(status) ?? []
        list.push(callback)
        this.statusHandlers.set(status, list)
    }

    emit(values: AcceptedDeltaValue[]): void {
        for (const value of values) {
            const pathList = this.pathHandlers.get(value.path)
            if (pathList) {
                for (const cb of pathList) cb(value)
            }

            const statusList = this.statusHandlers.get(value.validationStatus)
            if (statusList) {
                for (const cb of statusList) cb(value as Extract<AcceptedDeltaValue, { validationStatus: ValidationStatus }>)
            }

            if (value.validationStatus !== 'validated') continue
            const schemaList = this.schemaHandlers.get(value.schemaName)
            if (!schemaList) continue
            for (const cb of schemaList) cb(value)
        }
    }
}
