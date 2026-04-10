# typebox_concept

Signal K TypeBox validation library with an internal smoke-test client for manual runtime verification.

## Project layout
- `src/lib/`: publishable library modules (schemas, parser, validators, types)
- `smoke-test-client/`: internal runnable client harness (not published)
- `test/`: library unit/integration tests run via Node's built-in test runner with `tsx`

## Library behavior
- Processes both `updates[].values[]` and `updates[].meta[]`
- Builds `path -> meta.type` mapping from meta updates
- Resolves `meta.type` to known TypeBox schema names
- Emits an explicit `ParsedValue` result for every accepted value entry
- Uses four result branches: `ValidatedValue`, `InvalidValue`, `NoSchemaTypeValue`, and `UnknownSchemaTypeValue`
- Validates known schemas, preserves structured TypeBox validation errors for invalid values, and keeps missing or unknown `meta.type` fail-open

## Public API
- Schemas: `PositionSchema`, `NumericSchema`
- Types: `Position`, `Numeric`, `SignalKSchemaName`
- Validators: `createSchemaValidators()`
- Parser runtime: `createParserRuntime()` with `indexSchemaTypes()`, `validateValues()`, and `processValues()`
- Parser result types: `ParsedValue`, `ValidatedValue`, `InvalidValue`, `NoSchemaTypeValue`, `UnknownSchemaTypeValue`

## Commands
```bash
npm install
npm run clean
npm run build
npm run test
npm run schemas:snapshot
npm run schemas:build
npm run schemas:verify
npm run schemas:compare
```

## Runtime format generation (`formats.ts`)

The runtime format registration module is generated, not hand-written.

- Source of truth: `staging/schemas/format-mapping-registry.mjs`
- Generator: `staging/schemas/generate-runtime-format-module.mjs`
- Generated output: `src/lib/formats.ts`

This writes `src/lib/formats.ts` from `FORMAT_RULES` in the shared registry.

### Automatic generation behavior

Generation is embedded in the build and schema commands (no separate `pre*` npm hooks and no standalone npm wrapper command):

- `npm run build` runs clean -> format generation -> TypeScript build
- `npm run test` runs test TypeScript check -> test execution
- `npm run schemas:build` runs schema generation and regenerates runtime formats
- `npm run schemas:verify` runs schema build -> integrity -> determinism

This keeps schema-emitted format names and runtime `Format.Set(...)` validators in sync.

### Recommended sequencing

For a clean local verification flow:

```bash
npm install
npm run build
npm run test
npm run schemas:verify
```

For schema-only iteration:

```bash
npm run schemas:build
npm run schemas:verify
```

because each command already includes what it needs.

## Notes
- This package publishes only the library output under `dist/lib`.
- `smoke-test-client` is for manual verification and is not part of the public API.
- Automated tests run TypeScript test files directly via `node --import tsx --test`.
- Current coverage starts with parser unit tests; add more cases under `test/unit` and `test/integration`.
- Missing/unknown `meta.type` intentionally uses fail-open behavior.
- Invalid known-schema values are not dropped; they are emitted as `InvalidValue` with `validationErrors`.
- Validation uses local TypeBox schemas and compiled runtime validators.

## Smoke-test-client
The purpose of the smoke-test-client is to provide a simple runtime verification tool for the library's behavior against live Signal K server data. It connects to a server, subscribes to all paths and meta (default) with an update policy of 1000ms (default), and logs validation results for every parsed value. It is not intended for automated testing or as part of the public API, but rather as a manual verification harness during development and debugging.

Use the client against streams files and live servers to verify that the library correctly parses values.

### Configuration

The smoke-test-client connects to a live Signal K server, subscribes to a configurable set of paths, and logs validation results for every parsed value to the console. It is intended for manual runtime verification of the library's behavior against real server data.

See constants in `smoke-test-client/index.ts` for configuration:
- TARGET_PATHS (default `['*']`)
- WS_URL (default `ws://localhost:3000/signalk/v1/stream?subscribe=none&sendMeta=all`)
- UPDATE_INTERVAL (default `1000` ms)

### Validation mode logs
Console output includes validation mode markers:
- `[valid]`
- `[invalid]`
- `[unknown-value-type]`
- `[no-value-type]`

The smoke client prints colored status lines for every parsed value and includes the path on each line.
