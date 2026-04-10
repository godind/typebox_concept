import fs from 'node:fs'
import path from 'node:path'

const EPOCH_ISO = '1970-01-01T00:00:00.000Z'

export function deterministicGeneratedAt() {
  const rawEpoch = process.env.SOURCE_DATE_EPOCH
  if (!rawEpoch) return EPOCH_ISO

  const parsed = Number(rawEpoch)
  if (!Number.isFinite(parsed)) return EPOCH_ISO
  return new Date(parsed * 1000).toISOString()
}

export function writeManifest(outDir, manifest) {
  fs.mkdirSync(outDir, { recursive: true })
  const manifestPath = path.join(outDir, 'manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
}
