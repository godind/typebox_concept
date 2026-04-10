export const DOC_SECTION_ORDER = [
  'summary',
  'description',
  'constraints',
  'enum',
  'default',
  'examples',
  'format',
  'pattern',
  'provenance',
  'lifecycle'
]

export const METADATA_MAPPING_SPEC = {
  title: {
    target: 'summary',
    rule: 'Use as first-line summary. Fallback to symbol name.'
  },
  description: {
    target: 'description',
    rule: 'Use as main hover text. Fallback to explicit unavailable marker.'
  },
  enum: {
    target: 'enum',
    rule: 'List literal values and count when detectable.'
  },
  const: {
    target: 'enum',
    rule: 'Treat as a one-value enum.'
  },
  default: {
    target: 'default',
    rule: 'Show default hint when present.'
  },
  examples: {
    target: 'examples',
    rule: 'Render deterministic subset ordered by source appearance.'
  },
  format: {
    target: 'format',
    rule: 'Show semantic format hints and runtime validation linkage.'
  },
  pattern: {
    target: 'pattern',
    rule: 'Show regex expectation and pattern count.'
  },
  numericBounds: {
    target: 'constraints',
    rule: 'Summarize minimum/maximum and exclusive variants.'
  },
  sizeBounds: {
    target: 'constraints',
    rule: 'Summarize minLength/maxLength/minItems/maxItems.'
  },
  required: {
    target: 'constraints',
    rule: 'Show required marker availability where detectable.'
  },
  deprecated: {
    target: 'lifecycle',
    rule: 'Mark deprecated usage and suggested migration if available.'
  },
  readOnly: {
    target: 'lifecycle',
    rule: 'Show readOnly semantics when present.'
  },
  writeOnly: {
    target: 'lifecycle',
    rule: 'Show writeOnly semantics when present.'
  },
  provenance: {
    target: 'provenance',
    rule: 'Include source schema path and generated file location.'
  }
}

export const MISSING_METADATA_TEXT = 'metadata unavailable from specification export'
