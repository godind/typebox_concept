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
npm run generate:runtime-formats
npm run typecheck
npm run build
npm run smoke
npm run test
npm run test:watch
npm run test:typecheck
```

## Runtime format generation (`formats.ts`)

The runtime format registration module is generated, not hand-written.

- Source of truth: `staging/phase3/format-mapping-registry.mjs`
- Generator: `staging/phase3/generate-runtime-format-module.mjs`
- Generated output: `src/lib/formats.ts`

### Manual generation command

```bash
npm run generate:runtime-formats
```

This writes `src/lib/formats.ts` from `FORMAT_RULES` in the shared registry.

### Automatic generation hooks

The following npm lifecycle hooks regenerate `src/lib/formats.ts` automatically before their main command:

- `prebuild` -> runs before `npm run build`
- `pretypecheck` -> runs before `npm run typecheck`
- `pretest` -> runs before `npm run test`
- `pretest:typecheck` -> runs before `npm run test:typecheck`

This keeps schema-emitted format names and runtime `Format.Set(...)` validators in sync.

### Recommended sequencing

For a clean local verification flow:

```bash
npm install
npm run generate:runtime-formats
npm run typecheck
npm run test
npm run build
```

For quick iteration, you can skip the explicit generation step and run:

```bash
npm run typecheck
npm run test
npm run build
```

because each command already triggers generation via pre-scripts.

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
