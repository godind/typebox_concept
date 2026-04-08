# typebox_concept

Signal K WebSocket concept client for testing TypeBox-first schema validation with meta.type-driven schema selection.

## What it does
- Connects to `ws://192.168.10.100:3000/signalk/v1/stream?subscribe=none`
- Unsubscribes from defaults
- Subscribes to context `vessels.self` paths:
  - `navigation.position`
  - `environment.wind.speedOverGround`
- Processes both `updates[].values[]` and `updates[].meta[]`
- Builds `path -> meta.type` mapping from meta updates
- Resolves `meta.type` to known TypeBox schema names:
  - `PositionDeltaValue`
  - `NumericDeltaValue`
- Applies validation only for known schema names
- If `meta.type` is missing or unknown, accepts message without validation

## Validation mode logs
Console output includes validation mode markers:
- `[validated]`
- `[accepted-unvalidated]`

## Commands
```bash
npm install
npm run typecheck
npm run build
npm run start
```

## Notes
- This is a concept app, not a production-grade client.
- Missing/unknown `meta.type` intentionally uses fail-open behavior.
- Validation uses local TypeBox schemas and runtime checks via `Value.Check`.
