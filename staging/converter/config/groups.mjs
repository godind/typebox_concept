import path from 'node:path'

const SCHEMAS_DIR = path.resolve('staging/schemas')

export const GROUPS = [
  {
    name: 'foundation',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch0-foundation/generate-foundation-batch0.mjs')
  },
  {
    name: 'messaging',
    aliases: ['protocol'],
    generator: path.join(SCHEMAS_DIR, 'batch1-messaging/generate-messaging-batch1.mjs')
  },
  {
    name: 'navigation',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch2-navigation/generate-navigation-batch2.mjs')
  },
  {
    name: 'environment',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch3-environment/generate-environment-batch3.mjs')
  },
  {
    name: 'electrical',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch4-electrical/generate-electrical-batch4.mjs')
  },
  {
    name: 'propulsion-steering',
    aliases: ['propulsion'],
    generator: path.join(SCHEMAS_DIR, 'batch5-propulsion-steering/generate-propulsion-steering-batch5.mjs')
  },
  {
    name: 'tanks-design',
    aliases: ['vessel'],
    generator: path.join(SCHEMAS_DIR, 'batch6-tanks-design/generate-tanks-design-batch6.mjs')
  },
  {
    name: 'sails-performance',
    aliases: ['performance'],
    generator: path.join(SCHEMAS_DIR, 'batch7-sails-performance/generate-sails-performance-batch7.mjs')
  },
  {
    name: 'communication-sensors-sources',
    aliases: ['comms'],
    generator: path.join(SCHEMAS_DIR, 'batch8-communication-sensors-sources/generate-communication-sensors-sources-batch8.mjs')
  },
  {
    name: 'notifications',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch9-notifications/generate-notifications-batch9.mjs')
  },
  {
    name: 'resources',
    aliases: [],
    generator: path.join(SCHEMAS_DIR, 'batch10-resources/generate-resources-batch10.mjs')
  },
  {
    name: 'non-vessel-variants',
    aliases: ['variants'],
    generator: path.join(SCHEMAS_DIR, 'batch11-non-vessel-variants/generate-non-vessel-batch11.mjs')
  }
]

export const RUNTIME_FORMAT_GENERATOR = path.join(SCHEMAS_DIR, 'generate-runtime-format-module.mjs')
