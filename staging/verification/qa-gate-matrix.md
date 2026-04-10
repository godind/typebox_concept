# Phase 4 QA Gate Matrix

This phase defines the verification contract for staged Signal K schema generation before any Gate E promotion work touches the active library surface.

## Gate E Scope

- Goal: prove staged artifacts are reproducible, internally consistent, and safe to promote.
- Promotion boundary: Phase 4 validates staging only; it does not move staged schemas into active runtime imports.
- Current known staging debt: Batch 0 and Batch 5 each still report one warning in their manifests. Those warnings are visible quality debt, not hidden failures.
- Current Gate E review status: approved with accepted staging debt documented in gate-e-review.md.

## Gate E Checks

| Check | Command | Threshold | Current Intent |
| --- | --- | --- | --- |
| Test TypeScript surface | `npm run test:typecheck` | 0 errors | Required |
| Runtime/unit integration | `npm test` | All tests pass | Required |
| Staging manifest and artifact integrity | `npm run verify:quality-gates:integrity` | 0 integrity failures | Required |
| Generator determinism | `npm run verify:quality-gates:determinism` | identical hash across two consecutive full regen passes | Required |
| Performance baseline | manual timing during Gate E review | no enforced threshold yet | Advisory |

## Integrity Coverage

The integrity check validates the staged generation surface for:

- manifest presence for every Phase 3 batch directory
- generator presence for every Phase 3 batch directory
- output artifact existence for every manifest-declared file
- duplicate staged output path detection
- schema and type export presence in generated output modules
- runtime format module presence and registration entrypoint
- zero manifest exceptions across all Phase 3 batches

Warnings are reported, but they are not treated as integrity failures. This keeps the check aligned with the current staged state while making unresolved warning debt explicit.

## Determinism Coverage

The determinism check runs every batch generator plus runtime format generation twice, then hashes the generated artifact set after each pass. The check fails if the two hashes differ.

## Gate E Exit Conditions

- Required commands all pass.
- Remaining warnings are either resolved or explicitly accepted in the Gate E review note.
- No active-runtime imports are changed until Gate E approval is recorded.