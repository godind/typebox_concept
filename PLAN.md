# Signal K Meta-Type Routed Validation Plan

## Goal
Build a TypeScript concept app that connects to a Signal K server at `192.168.10.100:3000` via WebSocket, subscribes to `vessels.self` paths `navigation.position` and `environment.wind.speedOverGround`, and logs values to console. Validation must be selected by per-path `meta.type`, not by static path-to-schema mapping.

## Key Change in Design
Replace static path-to-schema correlation with a runtime mapping derived from metadata:
- Read per-path metadata key `meta.type`.
- Build and maintain mapping: `path -> meta.type`.
- Map `meta.type` string to a known TypeBox schema by schema name.
- If `meta.type` is missing or unknown, skip validation and accept the message.

## Architecture

### 1. Project setup
- Node + TypeScript (`strict`) with `npm`.
- Runtime dependencies:
  - WebSocket client library.
  - `@sinclair/typebox` and `@sinclair/typebox/value`.
- Scripts:
  - `npm run typecheck`
  - `npm run build`
  - `npm run start`

### 2. Schema layer (TypeBox-first)
Define TypeBox schemas and give each one a registry name that can match incoming `meta.type` values.

Core schemas:
- `NormalizedBaseDeltaSchema`
- `PositionDeltaValueSchema`
- `NumericDeltaValueSchema`

Also define static types from schemas using `Static<typeof ...>`.

### 3. Schema registry by name
Maintain registry:
- Key: `schemaName` (string, expected from `meta.type`)
- Value: TypeBox schema + type metadata used for strongly-typed handlers

Example conceptual entries:
- `PositionDeltaValue` -> `PositionDeltaValueSchema`
- `NumericDeltaValue` -> `NumericDeltaValueSchema`

### 4. Metadata ingestion and path mapping
From incoming deltas, process `updates[].meta[]` entries:
- Read `meta.path`.
- Read `meta.value.type` (treated as `meta.type`).
- Store in in-memory map: `pathToMetaType[path] = metaTypeString`.
- On subsequent meta messages, overwrite existing mapping for that path.

### 5. Delta normalization and conditional validation
For each `updates[].values[]` item:
1. Build normalized base candidate:
   - `context`, `$source`, `source`, `path`, `timestamp`, `value`.
2. Lookup `metaType = pathToMetaType[path]`.
3. Resolve `metaType` in schema registry.
4. Behavior:
   - Known schema:
     - Validate with `Value.Check(schema, candidate)`.
     - Accept only if valid.
   - Missing/unknown schema:
     - Skip validation.
     - Accept candidate (fail-open, as required).

Each accepted item should carry a status marker:
- `validated`
- `accepted-unvalidated`

### 6. Typesafe router pattern (meta-type driven)
Implement `TypesafeSkRouter` pattern with two dispatch styles:
- Typed dispatch for known schema names.
- Generic dispatch for unknown/unvalidated payloads.

Router should support:
- Register callbacks by path and/or schema name.
- Emit validated typed payloads for known schema names.
- Emit generic payload for accepted-unvalidated data.

This preserves type safety where possible while honoring required fail-open behavior.

### 7. WebSocket connection and subscriptions
Connect to:
- `ws://192.168.10.100:3000/signalk/v1/stream?subscribe=none`

On open:
1. Send unsubscribe-all:
```json
{
  "context": "*",
  "unsubscribe": [{ "path": "*" }]
}
```
2. Send subscribe for required context/paths:
```json
{
  "context": "vessels.self",
  "subscribe": [
    { "path": "navigation.position" },
    { "path": "environment.wind.speedOverGround" }
  ]
}
```

Client loop must process both:
- `values` updates (data)
- `meta` updates (for `meta.type` mapping)

### 8. Console output requirements
Print to console for subscribed paths:
- `navigation.position`:
  - latitude/longitude when value is object
  - null-safe handling
- `environment.wind.speedOverGround`:
  - numeric/null-safe output

Include validation mode in logs (recommended):
- `[validated]`
- `[accepted-unvalidated]`

### 9. Error handling
- Invalid JSON: log and continue.
- Unknown message shape: ignore safely.
- Validation failures for known schema: drop value and log reason.
- Missing/unknown `meta.type`: accept without validation.
- WebSocket close/error: log lifecycle events.

### 10. Documentation
README should describe:
- Server endpoint
- Subscription paths
- `meta.type`-driven validation model
- Fail-open behavior for missing/unknown `meta.type`
- Run commands

## Verification Checklist
1. `npm run typecheck` passes.
2. `npm run build` passes.
3. On connect, unsubscribe/subscribe messages are sent correctly.
4. Meta updates populate `path -> meta.type` mapping.
5. Known `meta.type` values trigger correct TypeBox validation.
6. Invalid data for known schemas is rejected.
7. Missing/unknown `meta.type` data is accepted and logged as unvalidated.
8. Console prints expected outputs for:
   - `navigation.position`
   - `environment.wind.speedOverGround`
9. Process remains stable under malformed or partial messages.

## Scope and Constraints
Included:
- Concept app only
- Live WebSocket stream
- TypeBox validation selected by metadata
- Typed routing where possible

Not included:
- UI
- Persistence of path/meta mappings across restarts
- Advanced reconnect/backoff policy
- Full Signal K schema coverage

## Implementation Notes
- Favor local TypeBox schemas for runtime behavior and clarity.
- External Signal K types can be used where practical, but avoid coupling that complicates the concept app.
- Keep fail-open behavior explicit and intentional; this is the primary requirement change from static path mapping.