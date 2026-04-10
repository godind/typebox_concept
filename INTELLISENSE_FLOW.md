# IntelliSense Helper Generation Flow: Position Example

## 1️⃣ UPSTREAM SPEC (Signal K JSON Schema)
**Source:** https://raw.githubusercontent.com/SignalK/specification/master/schemas/definitions.json

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
            "type": "object",
            "required": ["latitude", "longitude"],
            "properties": {
              "longitude": {
                "type": "number",
                "description": "Longitude",
                "units": "deg",
                "example": 4.98765245
              },
              "latitude": {
                "type": "number",
                "description": "Latitude",
                "units": "deg",
                "example": 52.0987654
              },
              "altitude": {
                "type": "number",
                "description": "Altitude",
                "units": "m"
              }
            }
          }
        }
      }
    ]
  }
}
```

**Key metadata extracted from upstream:**
- `title` → "position"
- `description` → "The position in 3 dimensions"
- `type` constraints → object with required fields
- `examples` → 4.98765245, 52.0987654
- Structural composition → allOf combining commonValueFields + position-specific properties

---

## 2️⃣ CONVERTER PHASE (npm run schemas:build)
**Converter Rule:** JSON Schema Draft-04 → TypeBox
**File:** `converter/app/batch/batch0-foundation.mjs`

**Conversion Logic:**
- `allOf` + referenced commonValueFields → TypeBox `Type.Intersect()`
- `type: "object"` → `Type.Object()`
- `properties` → TypeBox object properties
- Metadata (title, description, examples) → Embedded in Type.Object options
- Required fields → Enforced in schema

```javascript
// Conceptual conversion (simplified):
Type.Intersect([
  Type.Ref("#/definitions/commonValueFields"),  // Brings in: $source, timestamp, meta, pgn, sentence
  Type.Object({
    "value": Type.Optional(Type.Object({
      "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
      "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
      "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
    })),
    "values": Type.Optional(Type.Record(Type.String(), /* multi-source tracking */))
  })
], { $id: "signalk://schemas/definitions#Position" })
```

**Output:** `src/lib/schemas/foundation/foundation-definitions.ts`

---

## 3️⃣ GENERATED SCHEMA FILE
**File:** [src/lib/schemas/foundation/foundation-definitions.ts](src/lib/schemas/foundation/foundation-definitions.ts#L162)

```typescript
export const PositionSchema = Type.Intersect([
  Type.Ref("signalk://schemas/definitions#CommonValueFields"),
  Type.Object({
      "value": Type.Optional(Type.Object({
          "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
          "latitude": Type.Number({"description":"Latitude","examples":[52.0987654]}),
          "longitude": Type.Number({"description":"Longitude","examples":[4.98765245]})
        })),
      "values": Type.Optional(Type.Record(Type.String(), Type.Object({
            "pgn": Type.Optional(Type.Number()),
            "sentence": Type.Optional(Type.String()),
            "timestamp": Type.Optional(Type.Ref("signalk://schemas/definitions#Timestamp")),
            "value": Type.Optional(Type.Object({
                "altitude": Type.Optional(Type.Number({"description":"Altitude"})),
                "latitude": Type.Optional(Type.Number({"description":"Latitude","examples":[52.0987654]})),
                "longitude": Type.Optional(Type.Number({"description":"Longitude","examples":[4.98765245]}))
              }))
          })))
    })
], { $id: "signalk://schemas/definitions#Position" })
export type Position = Type.Static<typeof PositionSchema>
```

**What it contains:**
- ✅ Metadata preserved in TypeBox Type() options: `{"description":"...", "examples":[...]}`
- ✅ Full type safety via TypeBox/TypeScript
- ✅ Runtime schema validation capability
- ⚠️ But metadata is **buried in code** → IDE can't easily see it without reading source

---

## 4️⃣ INTELLISENSE HELPER GENERATION
**Script:** `npm run schema:publish`
→ Calls `converter/app/publish/generate-intellisense-helpers.mjs`

**Generator Logic (for Position):**

```javascript
function buildDocSections(symbol, sourceRelPath, sourceText) {
  // Read the TypeBox source directly
  const title = readFirstJsonString(sourceText, 'title') || symbol
  // Search for: "title":"..."  →  NOT FOUND in Position (title was in upstream, not in generated Type())
  // Fallback: symbol name = "Position"
  
  const description = readFirstJsonString(sourceText, 'description') || MISSING_METADATA_TEXT
  // Search for: "description":"..." in the source
  // FOUND: {"description":"Altitude"}, {"description":"Latitude"...}, etc. (from properties)
  // Problem: Multiple descriptions across properties
  // Decision: Use MISSING_METADATA_TEXT as fallback for top-level
  
  const formats = readAllJsonStrings(sourceText, 'format')
  // Search for: "format":"..." → FOUND (likely from inherited commonValueFields like Timestamp)
  // Extract: date-time, source-ref patterns, etc.
  
  const patterns = readAllJsonStrings(sourceText, 'pattern')
  // Search for: "pattern":"..." → FOUND (from inherited schemas)
  
  const examples = countOccurrences(sourceText, '"examples":')
  // Count occurrences → FOUND: 4 (from latitude, longitude examples)
  
  return {
    summary: "Position",  // Fallback to symbol name
    description: "metadata unavailable from specification export",  // Fallback marker
    constraints: "numeric bounds markers: min=0, max=0, ...",
    enum: "literal options not detected",
    default: "default markers not detected",
    examples: "example markers detected: 4",
    format: "formats: date-time, source-ref, ...",
    pattern: "patterns: ...",
    provenance: "source: src/lib/schemas/foundation/foundation-definitions.ts",
    lifecycle: "deprecated markers=0, readOnly markers=0, writeOnly markers=0"
  }
}
```

---

## 5️⃣ INTELLISENSE SIDECAR FILE
**File:** [converter/helpers/schema-intellisense.ts](converter/helpers/schema-intellisense.ts#L477)

```typescript
/**
 * summary: Position
 * description: metadata unavailable from specification export
 * constraints: numeric bounds markers: min=0, max=0, exMin=0, exMax=0; size markers: minLength=0, maxLength=0, minItems=0, maxItems=0; required markers=0
 * enum: literal options not detected
 * default: default markers not detected
 * examples: example markers detected: 4
 * format: formats: date-time, source-ref, ...
 * pattern: patterns: ...
 * provenance: source: src/lib/schemas/foundation/foundation-definitions.ts
 * lifecycle: deprecated markers=0, readOnly markers=0, writeOnly markers=0
 */
export type PositionIntellisense = import('../../src/lib/schemas/foundation/foundation-definitions.js').Position
```

**Coverage (from manifest):**
```json
{
  "symbol": "Position",
  "sourceRelPath": "src/lib/schemas/foundation/foundation-definitions.ts",
  "coverage": {
    "hasDescription": true,
    "hasFormat": true,
    "hasPattern": true
  }
}
```

---

## 6️⃣ IDE USAGE - THE HOW & WHY

### A. How the IDE Sees It

**User Code:**
```typescript
import { PositionSchema, type Position } from '@/lib/schemas/foundation/foundation-definitions'
import type { PositionIntellisense } from '@/converter/helpers/schema-intellisense'

// IDEs hover over 'Position' type and show:
// - JSDoc comment from PositionIntellisense
// - Type structure breakdown
// - Available properties with their formats/patterns/examples
```

### B. When User Hovers Over `Position` Type

**Without IntelliSense Helper:**
```typescript
export type Position = Type.Static<typeof PositionSchema>
// IDE shows: "TypeBox-wrapped Position type"
// Not very helpful!
```

**With IntelliSense Helper:**
```typescript
/**
 * summary: Position
 * description: The position in 3 dimensions [from upstream spec]
 * examples: example markers detected: 4 [indicates lat/lon examples exist]
 * format: formats: date-time, source-ref, ... [runtime validation hints]
 * ...
 */
export type Position = Type.Static<typeof PositionSchema>
// IDE shows: Rich JSDoc with metadata, constraints, formats
// Much more discoverable!
```

### C. IDE IntelliSense Flow

```
User types:           let pos: Position
                      ↓
IDE reads type:       Type.Static<typeof PositionSchema>
                      ↓
IDE looks for JSDoc:  Finds PositionIntellisense export
                      ↓
IDE extracts @param:  Shows JSDoc comment block
                      ↓
IDE displays hover:   
┌─────────────────────────────────────────────┐
│ (type) Position                             │
│ summary: Position                           │
│ description: The position in 3 dimensions   │
│ constraints: required lat/lon, optional alt │
│ examples: 4 detected                        │
│ format: date-time, ...                      │
│ provenance: src/lib/schemas/.../position.ts│
└─────────────────────────────────────────────┘
```

### D. Real IDE Behaviors

**VS Code Intelligent Autocomplete:**
```typescript
const pos: Position = {
  value: {
    latitude: 5[TAB]   // IDE knows: Number, required, has example 52.0987654
    longitude: 4       // IDE knows: Number, required, has example 4.98765245
    altitude:          // IDE knows: Number, optional, in meters
  }
}
```

**GoLang/IntelliJ Hover Tooltips:**
```typescript
Position ← Hover shows JSDoc from PositionIntellisense
          Includes: description, constraints, examples, formats
          Reduces need to check original spec
```

---

## 🔄 Complete Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ UPSTREAM SPEC                                                   │
│ (Signal K JSON Schema - master branch)                          │
│ ├─ Position with allOf, properties, description, examples      │
│ └─ metadata: title, description, examples, units, patterns     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ converter/app/batch/ (npm run schemas:build)
                         │ TypeBox conversion rules (T01-T16)
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ TYPEBOX SCHEMA FILE                                             │
│ (src/lib/schemas/foundation/foundation-definitions.ts)          │
│ ├─ PositionSchema = Type.Intersect([...])                       │
│ ├─ Metadata embedded: {"description":"...", "examples":[...]}   │
│ └─ export type Position = Type.Static<typeof PositionSchema>   │
└────────────────────────┬────────────────────────────────────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │                                     │
      │ npm run schema:publish --force      │
      │ (2 streams in parallel)             │
      │                                     │
      ↓                                     ↓
┌──────────────┐                  ┌──────────────────────┐
│ FACADES      │                  │ INTELLISENSE HELPERS │
│ (Re-exports) │                  │ (Sidecar JSDoc)      │
│              │                  │                      │
│ export {     │                  │ /**                  │
│  Position... │                  │  * summary: ...      │
│ }            │                  │  * description: ...  │
│ from         │                  │  * format: ...       │
│ './schemas'  │                  │  * pattern: ...      │
│              │                  │  */                  │
└──────────────┘                  │ export type Position │
                                  │   Intellisense = ... │
                                  └──────────────────────┘
      │                                    │
      └──────────────────┬─────────────────┘
                         │
                         │ User imports & IDE usage
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ IDE INTELLISENSE DISPLAY                                        │
│ When user hovers or autocompletes Position:                     │
│ ├─ Shows JSDoc from PositionIntellisense sidecar               │
│ ├─ Displays summary, description, constraints                  │
│ ├─ Shows examples count & format hints                         │
│ └─ IDE can navigate to source via provenance path              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Metadata Coverage for Position

| Metadata | Upstream Value | TypeBox Encoded | Helper Extracted | IDE Shows |
|----------|---|---|---|---|
| **title** | "position" | ❌ Not in Type() options | ⚠️ Fallback: Symbol name | "Position" |
| **description** | "The position in 3 dimensions" | ❌ Not in Type.Intersect() options | ⚠️ Fallback marker | "metadata unavailable..." |
| **properties.latitude.description** | "Latitude" | ✅ In Type.Number({"description":"..."}) | ✅ Found in source text | Via JSDoc comment |
| **properties.latitude.example** | 52.0987654 | ✅ In Type.Number({"examples":[...]}) | ✅ Counted (4 total) | "example markers detected: 4" |
| **properties.latitude.units** | "deg" | ❌ Lost in conversion (TypeBox limitation) | ❌ Not detected | (Not available) |
| **$id** | — | ✅ In Type.Intersect({ $id: "..." }) | ✅ Via provenance | "signalk://schemas/definitions#Position" |

---

## 💡 Key Insights

1. **Two-Stage Metadata Flow:**
   - Upstream: Rich semantic metadata (title, description, units, examples)
   - TypeBox: Metadata embedded in Type() options, some lost (units, oneOf semantics)
   - Helper: Text-scraped from TypeBox source, with intelligent fallbacks

2. **Why Sidecar Files Are Necessary:**
   - TypeBox schemas are runtime-focused (validation), not IDE-focused
   - Metadata is scattered across Type() option objects
   - IDE can't easily extract and display it from inline definitions
   - Sidecar JSDoc concentrates metadata for IDE discovery

3. **The Validation vs. IntelliSense Tradeoff:**
   - PositionSchema: Fast, type-safe runtime validation
   - PositionIntellisense: Developer experience, IDE hints, spec link-back
   - Both serve different purposes in same library

4. **Future Improvement:**
   - Could enhance upstream converter to preserve units, constraints, etc. in TypeBox metadata
   - Could expand helper generator to extract deeper into Type() structure
   - Could auto-link "provenance" to actual spec source (HTTP link)
