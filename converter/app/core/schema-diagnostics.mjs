import { mkdir, readdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { schemaArtifactsRoot, schemaDiagnosticsRoot } from './runtime.mjs'

export async function writeSchemaDiagnostics() {
  await mkdir(schemaDiagnosticsRoot, { recursive: true })

  const entries = await readdir(schemaArtifactsRoot, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const manifestPath = path.join(schemaArtifactsRoot, entry.name, 'manifest.json')
    const diagnosticPath = path.join(schemaDiagnosticsRoot, `${entry.name}-manifest.json`)

    await copyFile(manifestPath, diagnosticPath)
  }
}
