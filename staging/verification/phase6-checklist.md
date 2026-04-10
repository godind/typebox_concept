# Phase 6 Checklist

Phase 6 title: Schema publish automation
Status: draft
Owner: TBD
Target gate: Gate G

## Confirmed Constraints

1. Single publish command in scope: `npm run schema:publish`.
2. No companion publish commands in this phase.
3. Publish targets use current `src/lib` surfaces in place.
4. Facades in scope: `transport`, `values`, `meta`, `spatial`, `identity`, and `protocol` re-export.
5. Helper output format: generated sidecar TypeScript helpers only.
6. Publish gate strictness: fail on both exceptions and warnings.
7. Manual post-publish operator step: run `npm run build` and `npm run test`.

## Phase 1 - Publish Contract and Scope Lock

1. Freeze publish source and target boundaries.
2. Define hard-stop failure policy.
3. Define publish manifest minimum fields.

Manual validation and approval after Phase 1:
1. Validate command scope, source/target boundaries, and hard-stop policy.
2. Approval required to proceed to Phase 2.

## Phase 2 - Metadata Mapping Spec

1. Produce concrete metadata-to-JSDoc and IntelliSense mapping spec.
2. Cover deterministic mappings for:
- `title`, `description`, `enum`, `const`, `default`, `examples`
- `format`, `pattern`, numeric bounds, length/item bounds
- `required`, `deprecated`, `readOnly`, `writeOnly`
- `$id`, `$ref`, provenance metadata
3. Define fallback behavior for missing metadata.
4. Define deterministic section ordering and serialization.

Manual validation and approval after Phase 2:
1. Review mapping coverage and fallback semantics.
2. Approval required to proceed to Phase 3.

## Phase 3 - Metadata Helper Generator Tool

1. Implement generator tool for sidecar TypeScript helper outputs.
2. Generate helper attachment manifest keyed by symbol + source hash.
3. Ensure folder creation before writes.
4. Ensure deterministic reruns and idempotency.

Manual validation and approval after Phase 3:
1. Validate generated helper output shape and manifest integrity.
2. Validate deterministic rerun behavior.
3. Approval required to proceed to Phase 4.

## Phase 4 - schema:publish Orchestrator

1. Add `schema:publish` script to `package.json`.
2. Implement one-run orchestration flow:
- preflight verify via `npm run schemas:verify`
- strict fail on warnings or exceptions
- promote schema artifacts to approved `src/lib` targets
- promote `converter/app/formatsOutput/formats.ts` to `src/lib/formats.ts`
- generate/update facades
- run metadata helper generation and attachment
- write publish manifest with hashes and coverage stats
3. End with explicit operator instruction to run manual `build` + `test`.

Manual validation and approval after Phase 4:
1. Validate orchestrator sequence and output artifacts.
2. Validate manifest contents and failure behavior.
3. Approval required to proceed to Phase 5.

## Phase 5 - Type Facade Integration

1. Generate/update approved facade files during publish.
2. Enforce facade contract:
- composition/re-export only from canonical promoted symbols
- no semantic rewrites of canonical schemas
3. Validate required facade exports.

Manual validation and approval after Phase 5:
1. Validate facade boundaries and export coverage.
2. Approval required to proceed to Phase 6.

## Phase 6 - Preservation and Safety Guarantees

1. Keep canonical schema files generated-only and overwrite-safe.
2. Keep enrichment in sidecar helper files only.
3. Fail publish when helper attachment targets are missing/stale/hash-mismatched.
4. Record helper coverage and unresolved metadata in publish manifest.

Manual validation and approval after Phase 6:
1. Validate no metadata loss across reruns.
2. Validate failure on stale/missing attachment targets.
3. Approval required to proceed to Phase 7.

## Phase 7 - Verification and Gate Evidence

1. Verify precondition: `npm run schemas:verify` pass.
2. Verify `npm run schema:publish` pass with zero unresolved attachment failures.
3. Verify deterministic rerun: second publish run yields no diffs when inputs are unchanged.
4. Capture evidence bundle:
- schema verify result and determinism hash
- publish manifest hash
- helper attachment manifest hash
- facade export validation summary
- unresolved metadata report
- explicit note that parser build/test remain manual post-publish

Manual validation and approval after Phase 7:
1. Review full evidence bundle for Gate G decision.
2. Approval required before broad adoption.

## Out of Scope

1. Upstream schema semantic changes.
2. New converter mapping rules outside approved backlog.
3. Public API breaking changes.
