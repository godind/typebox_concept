import { runNodeScript } from '../core/runtime.mjs'

runNodeScript('staging/converter/cli/build.mjs')
runNodeScript('staging/verification/check-phase4-integrity.mjs')
runNodeScript('staging/verification/check-generator-determinism.mjs')
