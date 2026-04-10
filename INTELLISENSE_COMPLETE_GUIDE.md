# IntelliSense Helper System: Complete Overview

## Quick Answer to Your Question

**"Where does the IntelliSense helper data come from?"**

The data flows through 4 stages:

```
Signal K Upstream Spec (JSON Schema)
  ↓ [npm run schemas:build - Converter rules T01-T16]
TypeBox Generated Schema (src/lib/schemas/)
  ↓ [npm run schema:publish - Text extraction & aggregation]
IntelliSense Sidecar (converter/helpers/schema-intellisense.ts)
  ↓ [IDE loading TypeScript type definitions]
Developer's IDE Hover/Autocomplete
```

---

## Position Example: The Complete Journey

### 1. **Upstream Specification** (JSON Schema Draft-04)
Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/definitions.json

```json
{
  "position": {
    "type": "object",
    "title": "position",
    "description": "The position in 3 dimensions",
    "allOf": [
      { "$ref": "#/definitions/commonValueFields" },
      {
        "properties": {
          "value": {
            "properties": {
              "longitude": {"type": "number", "description": "Longitude", "example": 4.98765245},
              "latitude": {"type": "number", "description": "Latitude", "example": 52.0987654},
              "altitude": {"type": "number", "description": "Altitude"}
            }
          }
        }
      }
    ]
  }
}
```

✅ Rich metadata: title, description, type constraints, examples

---

### 2. **Conversion Phase** (`npm run schemas:build`)
**File:** `converter/app/batch/batch0-foundation.mjs`

**Converter applies TypeBox rules:**
- Rule T11: `allOf` → `Type.Intersect([...])`
- Rule T07: `object` → `Type.Object({...})`
- Rule T04: `number` → `Type.Number({...})`
- Metadata preservation: `{"description":"...", "examples":[...]}`

**Result:** TypeBox TypeScript code

---

### 3. **Generated Schema** (TypeBox)
**File:** `src/lib/schemas/foundation/foundation-definitions.ts` (Line 162)

```typescript
export const PositionSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.Object({
          "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
          "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
          "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
        })),
      "values": Type.Optional(Type.Record(Type.String(), Type.Object({...})))
    })
], { $id: "signalk://schemas/definitions#Position" })

export type Position = Type.Static<typeof PositionSchema>
```

✅ Full runtime validation capability
❌ Metadata buried in code (not IDE-visible)

---

### 4. **IntelliSense Extraction** (`npm run schema:publish`)
**Script:** `converter/app/publish/generate-intellisense-helpers.mjs`

**For each symbol (Position):**

```javascript
// Read source file as plain text
const sourceText = readFileAsString('foundation-definitions.ts')

// Extract metadata via text patterns:
const metadata = {
  title: readFirstJsonString(sourceText, 'title') 
         || 'Position'  // Fallback: no title in Type() options
  
  description: readFirstJsonString(sourceText, 'description')
              || 'metadata unavailable from specification export'  // Fallback
  
  examples: countOccurrences(sourceText, '"examples":')  
           // Result: 4 (from latitude, longitude, and related schemas)
  
  constraints: {
    min: countOccurrences(sourceText, '"minimum":'),
    max: countOccurrences(sourceText, '"maximum":'),
    required: countOccurrences(sourceText, '"required":'),
    // ... more numeric bounds
  }
  
  formats: readAllJsonStrings(sourceText, 'format')
          // Result: ['date-time', 'source-ref', 'signalk-aircraft-mmsi', ...]
  
  patterns: readAllJsonStrings(sourceText, 'pattern')
           // Result: ['^[2-7][0-9]{8}$', '^97[0-9]{7}$', ...]
  
  provenance: 'src/lib/schemas/foundation/foundation-definitions.ts'
}

// Build JSDoc comment (10 sections in order)
const jsdoc = formatAsJSDoc(metadata)  // See next section
```

---

### 5. **IntelliSense Sidecar** (Generated)
**File:** `converter/helpers/schema-intellisense.ts`

```typescript
/**
 * summary: Position
 * description: metadata unavailable from specification export
 * constraints: numeric bounds markers: min=0, max=0, exMin=0, exMax=0; size markers: minLength=0, maxLength=0, minItems=0, maxItems=0; required markers=0
 * enum: literal options not detected
 * default: default markers not detected
 * examples: example markers detected: 4
 * format: formats: date-time, source-ref, signalk-aircraft-mmsi, signalk-aton-mmsi, signalk-source-ref, signalk-geohash, signalk-vessel-mmsi, signalk-sar-mmsi, signalk-uuid-urn, signalk-version
 * pattern: patterns: ^[2-7][0-9]{8}$, ^99[0-9]{7}$, ^[A-Za-z0-9-_.]*$, .*Z$, ^[0-9A-Za-z:]{1,}$, ^97[0-9]{7}$, ^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$, ^[0-9]{1,3}[.][0-9]{1,2}[.][0-9]{1,2}($|-[a-zA-Z0-9]+$)
 * provenance: source: src/lib/schemas/foundation/foundation-definitions.ts
 * lifecycle: deprecated markers=0, readOnly markers=0, writeOnly markers=0
 */
export type PositionIntellisense = import('../../src/lib/schemas/foundation/foundation-definitions.js').Position
```

✅ Rich JSDoc with standardized sections
✅ Non-invasive (sidecar file, doesn't modify main schema)
✅ IDE-discoverable (standard TypeScript JSDoc)

---

### 6. **IDE Integration** (User Experience)
**When developer hovers over `Position` type:**

```typescript
const myPos: Position
              ↑ HOVER

// IDE displays:
(type) Position

summary: Position
description: metadata unavailable from specification export
constraints: numeric bounds markers: min=0, max=0, ...
enum: literal options not detected
default: default markers not detected
examples: example markers detected: 4
format: formats: date-time, source-ref, signalk-aircraft-mmsi, ...
pattern: patterns: ^[2-7][0-9]{8}$, ^99[0-9]{7}$, ...
provenance: source: src/lib/schemas/foundation/foundation-definitions.ts
lifecycle: deprecated markers=0, readOnly markers=0, writeOnly markers=0
```

✅ All metadata visible without leaving IDE
✅ Reduces need to consult upstream spec
✅ Enables intelligent autocomplete
✅ Provides validation hints

---

## Metadata Extraction Details

### What Gets Extracted

The helper generator scans the TypeBox source file for these patterns:

| Pattern | What It Finds | Example |
|---------|---|---|
| `"title":"..."` | Title from Type() options | `"title":"position"` |
| `"description":"..."` | Description fields | `"description":"Latitude"` |
| `"format":"..."` | Runtime format hints | `"format":"date-time"` |
| `"pattern":"..."` | Regex patterns | `"pattern":"^[2-7][0-9]{8}$"` |
| `"examples":[...]` | Example values | `"examples":[52.0987654]` |
| `"minimum":...` | Numeric bounds | `"minimum":0` |
| `"maximum":...` | Numeric bounds | `"maximum":360` |
| `"required":...` | Required fields | `"required":["lat","lon"]` |
| `Type.Literal(...)` | Enum options | Counted occurrence of literal |
| `"default":...` | Default values | `"default":3600` |
| `"deprecated"...` | Lifecycle markers | Old/replaced fields |
| `"readOnly":true` | Read-only markers | Computed fields |
| `"writeOnly":true` | Write-only markers | Password fields |

### How Extraction Works

Three main extraction strategies:

1. **Single Value:** `readFirstJsonString(source, key)`
   - Finds first occurrence of `"key":"value"` 
   - Used for: title, description (top-level)
   - Returns: string or null

2. **Multiple Values:** `readAllJsonStrings(source, key)`
   - Finds all occurrences across full source
   - Used for: format, pattern, examples (could appear multiple times)
   - Returns: array of unique values

3. **Occurrences:** `countOccurrences(source, pattern)`
   - Counts how many times pattern appears
   - Used for: enums, constraints, defaults (to gauge metadata richness)
   - Returns: numeric count

### Fallback Behaviors

When metadata can't be extracted:

| Metadata | Not Found? | Fallback | Reason |
|----------|---|---|---|
| title | No title in Type() | Use symbol name | Always have something to display |
| description | No description found | "metadata unavailable..." | Explicit marker |
| examples | None detected | "example markers not detected" | Better than silence |
| enum | No Type.Literal() | "literal options not detected" | Clear expectation |
| format | No "format" in options | "formats not detected" | Honest about coverage |
| pattern | No "pattern" in options | "patterns not detected" | Honest about coverage |

---

## The Dual-Artifact System

Your library now operates with **two complementary artifacts** for schemas:

### Artifact 1: PositionSchema (Runtime)
**File:** `src/lib/schemas/foundation/foundation-definitions.ts`

**Purpose:** 
- ✅ Runtime schema validation
- ✅ Type-safe TypeScript compilation
- ✅ Canonical source of truth for data shape

**Characteristics:**
- Optimized for runtime performance
- Metadata embedded in Type() options
- Part of npm package bundle
- Used for: validation, serialization, type checking

### Artifact 2: PositionIntellisense (Development)
**File:** `converter/helpers/schema-intellisense.ts`

**Purpose:**
- ✅ IDE hover documentation
- ✅ Developer experience enhancement
- ✅ Knowledge transfer (examples, formats, constraints)

**Characteristics:**
- Optimized for discoverability
- Metadata in standardized JSDoc format
- NOT part of npm package bundle (dev-only)
- Used for: IDE hints, autocomplete, onboarding

---

## Processing Pipeline Architecture

```
                          npm run schema:publish
                          ↓
                 ┌────────────────────┐
                 │ Input: All TypeBox │
                 │ schema files       │
                 │ (src/lib/schemas/*) │
                 └────────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ↓               ↓               ↓
     ┌──────────┐  ┌────────────┐  ┌─────────────┐
     │ Facade   │  │IntelliSense│  │  Manifest   │
     │Generation│  │  Generator │  │ Recording   │
     └──────────┘  └────────────┘  └─────────────┘
          │               │               │
          ↓               ↓               ↓
    src/lib/         converter/         converter/
    facades/         helpers/           schemaDiagnostic/
    *.ts             *.ts               *.json


IntelliSense Generator Details:
┌────────────────────────────────────────────────┐
│ For Each Symbol (92 total):                    │
├────────────────────────────────────────────────┤
│ 1. Read source file (TypeBox schema)           │
│ 2. Extract metadata via text patterns          │
│ 3. Build JSDoc comment (10 sections)           │
│ 4. Write TypeScript type export                │
│ 5. Record coverage in manifest JSON            │
└────────────────────────────────────────────────┘

Output Files:
├─ schema-intellisense.ts (51KB)
│  └─ JSDoc comments + 92 type exports
│
└─ intellisense-attachment-manifest.json (20KB)
   └─ Per-symbol coverage metrics & hashes
```

---

## Section Order (Deterministic Output)

The JSDoc sections follow a fixed order (from `metadata-mapping-spec.mjs`):

```javascript
const DOC_SECTION_ORDER = [
  'summary',        // ← Single-line summary (title or fallback)
  'description',    // ← Main hover text
  'constraints',    // ← Numeric bounds, size limits, required fields
  'enum',           // ← Literal options count
  'default',        // ← Default value presence
  'examples',       // ← Example value count
  'format',         // ← Runtime format hints (validation linkage)
  'pattern',        // ← Regex pattern hints (validation expectation)
  'provenance',     // ← Link to source file
  'lifecycle'       // ← Deprecated/readonly/writeonly markers
]
```

**Why this order?**
- ✅ Most useful info first (summary, description)
- ✅ Constraints early (critical for usage)
- ✅ Format/pattern hints (validation expectations)
- ✅ Provenance last (where to find authoritative source)
- ✅ Deterministic (same input = same output always)

---

## Coverage Tracking

The manifest tracks which symbols had successful metadata extraction:

```json
{
  "symbol": "Position",
  "sourceRelPath": "src/lib/schemas/foundation/foundation-definitions.ts",
  "sourceHash": "013e569abdfe4b0f654e6840b3d4cfa58a9ec5ad...",
  "coverage": {
    "hasDescription": true,
    "hasFormat": true,
    "hasPattern": true
  }
}
```

**Coverage metrics:**
- `hasDescription`: Could extract top-level description
- `hasFormat`: Found at least one format hint in the schema
- `hasPattern`: Found at least one regex pattern

**Use for:**
- Identifying gaps in metadata
- Measuring spec enrichment
- Planning improvements (Phase 6-7 work)

---

## Key Insights

### 1. **Two-Path Metadata Flow**

```
Upstream → TypeBox Integration:
  ✅ Lossy process (some metadata lost in conversion)
  ✅ Runtime-focused (validation is primary goal)
  
TypeBox → IntelliSense Generator:
  ✅ Text-based extraction (pragmatic, adaptable)
  ✅ IDE-focused (discoverability is primary goal)
```

### 2. **Why Sidecar Files?**

❌ Can't modify `PositionSchema` directly:
- Would break runtime validation compatibility
- Would complicate schema definitions
- Would pollute canonical source

✅ Sidecar approach preserves:
- Clean separation of concerns
- Non-invasiveness to runtime schemas
- IDE-native discovery (standard JSDoc)

### 3. **Metadata Completeness**

Some metadata from upstream spec **cannot** be preserved in TypeBox:

| Metadata | Status | Why | Workaround |
|----------|--------|-----|-----------|
| title | Lost at top-level | TypeBox $id is primary ID | Fallback to symbol name |
| description | Lost at top-level | Embedded in child  properties | Fallback marker |
| units | Lost entirely | TypeBox doesn't track | Document separately |
| oneOf semantics | Converted to Union | TypeBox limitation | Accept lenient validation |

This is **acceptable** because:
- The canonical source is still the upstream spec
- The IntelliSense helper guides toward it (`provenance`)
- Most important metadata (examples, formats) IS preserved
- The library is documented and human-navigable

---

## Future Enhancements

The current system is functional but could be improved:

### Short Term (Phase 6-7)
- [ ] Include units in constraints section (if extractable)
- [ ] Link provenance to full upstream spec URL (not just file path)
- [ ] Generate markdown versions of JSDoc for documentation site

### Medium Term
- [ ] Enhance converter to preserve more metadata in TypeBox
- [ ] Create custom TypeBox metadata extension for units/constraints
- [ ] Generate Swagger/OpenAPI sidecar with full metadata

### Long Term
- [ ] Bi-directional sync: IDE annotations → Spec updates
- [ ] Semantic versioning enforcement based on metadata changes
- [ ] Automated validation that generated artifacts match spec

---

## Summary

The IntelliSense helper system works through:

1. **Extraction:** Text-based parsing of TypeBox schema files
2. **Organization:** Standardized JSDoc format (10 sections)
3. **Storage:** Sidecar files (non-invasive)
4. **Discovery:** IDE-native TypeScript/JSDoc
5. **Display:** IDE hover/autocomplete (standard behavior)

The result: **First-class developer experience** where schemas are self-documenting and require zero external knowledge to understand.

---

## Files Referenced

- **Generation Logic:** [converter/app/publish/generate-intellisense-helpers.mjs](converter/app/publish/generate-intellisense-helpers.mjs)
- **Mapping Spec:** [converter/app/publish/metadata-mapping-spec.mjs](converter/app/publish/metadata-mapping-spec.mjs)
- **Orchestrator:** [converter/app/cli/publish.mjs](converter/app/cli/publish.mjs)
- **Generated Output:** [converter/helpers/schema-intellisense.ts](converter/helpers/schema-intellisense.ts)
- **Manifest:** [converter/helpers/intellisense-attachment-manifest.json](converter/helpers/intellisense-attachment-manifest.json)
- **Spec Document:** [staging/verification/metadata-jsdoc-intellisense-spec.md](staging/verification/metadata-jsdoc-intellisense-spec.md)
