# typebox_concept

Signal K TypeBox validation library with an internal smoke-test client for manual runtime verification.

## Project layout
- `src/lib/`: publishable library modules (schemas, parser, validators, types)
- `smoke-test-client/`: internal runnable client harness (not published)
- `test/`: library test scaffolding only (no test files authored yet)

## Library behavior
- Processes both `updates[].values[]` and `updates[].meta[]`
- Builds `path -> meta.type` mapping from meta updates
- Resolves `meta.type` to known TypeBox schema names
- Emits an explicit `ParsedValue` result for every accepted value entry
- Uses four result branches: `ValidatedValue`, `InvalidValue`, `NoValueTypeValue`, and `UnknownValueTypeValue`
- Validates known schemas, preserves structured TypeBox validation errors for invalid values, and keeps missing or unknown `meta.type` fail-open

## Validation mode logs
Console output includes validation mode markers:
- `[valid]`
- `[invalid]`
- `[unknown-value-type]`
- `[no-value-type]`

The smoke client prints colored status lines for every parsed value and includes the path on each line.

## Public API
- Schemas: `PositionSchema`, `NumericSchema`
- Types: `Position`, `Numeric`, `SignalKSchemaName`
- Validators: `createDeltaValidators()`
- Parser runtime: `createParserRuntime()` with `indexSchemaTypes()`, `validateValues()`, and `processValues()`
- Parser result types: `ParsedValue`, `ValidatedValue`, `InvalidValue`, `NoValueTypeValue`, `UnknownValueTypeValue`

## Commands
```bash
npm install
npm run typecheck
npm run build
npm run smoke
npm run test
npm run test:watch
npm run test:typecheck
```

## Notes
- This package publishes only the library output under `dist/lib`.
- `smoke-test-client` is for manual verification and is not part of the public API.
- Test infrastructure is prepared for library-only tests; actual tests are intentionally not added in this phase.
- Missing/unknown `meta.type` intentionally uses fail-open behavior.
- Invalid known-schema values are not dropped; they are emitted as `InvalidValue` with `validationErrors`.
- Validation uses local TypeBox schemas and compiled runtime validators.
