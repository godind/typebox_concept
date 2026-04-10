# Metadata to JSDoc and IntelliSense Mapping Spec

This specification defines deterministic metadata enrichment for `schema:publish`.

## Purpose

1. Convert schema metadata into stable JSDoc and IntelliSense helper content.
2. Keep canonical generated schema files overwrite-safe.
3. Preserve authored developer guidance through sidecar TypeScript helper artifacts.

## Source Priority

1. Upstream-derived metadata present in promoted schema output.
2. Inferred markers from generated TypeBox source when explicit metadata is absent.
3. Explicit unavailable marker when metadata is not discoverable.

## Mapping Rules

1. `title` -> summary section.
2. `description` -> description section.
3. `enum` or `const` -> enum section.
4. `default` -> default section.
5. `examples` or `example` -> examples section.
6. `format` -> format section.
7. `pattern` -> pattern section.
8. numeric bounds -> constraints section.
9. size bounds -> constraints section.
10. `required` -> constraints section.
11. `deprecated`, `readOnly`, `writeOnly` -> lifecycle section.
12. `$id`, `$ref`, and source path -> provenance section.

## Section Order

1. summary
2. description
3. constraints
4. enum
5. default
6. examples
7. format
8. pattern
9. provenance
10. lifecycle

## Determinism Rules

1. Symbol processing order uses stable alphabetical sorting.
2. Section order is fixed.
3. Attachment manifest entries are sorted by symbol.
4. Missing metadata uses a stable text marker:
- `metadata unavailable from specification export`

## Outputs

1. Sidecar helper file:
- `converter/helpers/schema-intellisense.ts`

2. Attachment manifest:
- `converter/helpers/intellisense-attachment-manifest.json`

3. Publish manifest includes helper hashes and unresolved metadata count.

## Validation

1. Publish fails if helper attachment targets are missing.
2. Publish fails if schema manifests contain warnings or exceptions.
3. Publish rerun with unchanged inputs must produce no diffs.
