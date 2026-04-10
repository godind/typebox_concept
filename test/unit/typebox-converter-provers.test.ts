import assert from 'node:assert/strict'
import test from 'node:test'

// @ts-ignore staging converter module is JS-only and intentionally imported for behavior tests
import { proveEnumPropertyDiscriminatorDisjoint, proveResourcesGeometryDisjoint } from '../../staging/schemas/shared/typebox-converter.mjs'

test('proveEnumPropertyDiscriminatorDisjoint returns null when discriminator is not required', () => {
  const variantSchemas = [
    {
      type: 'object',
      properties: {
        type: { enum: ['Polygon'] },
        coordinates: { type: 'array' },
      },
      required: ['coordinates'],
    },
    {
      type: 'object',
      properties: {
        type: { enum: ['MultiPolygon'] },
        coordinates: { type: 'array' },
      },
      required: ['coordinates'],
    },
  ]

  const proof = proveEnumPropertyDiscriminatorDisjoint(variantSchemas)
  assert.equal(proof, null)
})

test('proveEnumPropertyDiscriminatorDisjoint returns proof when discriminator is required and unique', () => {
  const variantSchemas = [
    {
      type: 'object',
      properties: {
        type: { enum: ['Polygon'] },
        coordinates: { type: 'array' },
      },
      required: ['type', 'coordinates'],
    },
    {
      type: 'object',
      properties: {
        type: { enum: ['MultiPolygon'] },
        coordinates: { type: 'array' },
      },
      required: ['type', 'coordinates'],
    },
  ]

  const proof = proveEnumPropertyDiscriminatorDisjoint(variantSchemas)
  assert.ok(proof?.includes("discriminating property 'type'"))
})

test('proveResourcesGeometryDisjoint proves known resources geometry oneOf branch', () => {
  const variantSchemas = [
    {
      properties: {
        type: { enum: ['Polygon'] },
        coordinates: { $ref: '../external/geojson/geometry.json#/definitions/polygon' },
      },
    },
    {
      properties: {
        type: { enum: ['MultiPolygon'] },
        coordinates: {
          type: 'array',
          items: { $ref: '../external/geojson/geometry.json#/definitions/polygon' },
        },
      },
    },
  ]

  const proof = proveResourcesGeometryDisjoint(
    variantSchemas,
    'schemas/groups/resources.json#.regions.patternProperties.feature.geometry',
    'schemas/groups/resources.json'
  )

  assert.ok(proof?.includes('resources geometry oneOf branches are disjoint'))
})

test('proveResourcesGeometryDisjoint returns null outside resources geometry context', () => {
  const variantSchemas = [
    { properties: { type: { enum: ['Polygon'] } } },
    { properties: { type: { enum: ['MultiPolygon'] } } },
  ]

  const proof = proveResourcesGeometryDisjoint(
    variantSchemas,
    'schemas/groups/resources.json#.routes.patternProperties.feature.geometry',
    'schemas/groups/resources.json'
  )

  assert.equal(proof, null)
})