import { runNodeScript } from '../core/runtime.mjs'

runNodeScript('converter/app/cli/build.mjs')
runNodeScript('converter/app/validators/validate-schema-artifacts.mjs')
runNodeScript('converter/app/validators/check-generator-determinism.mjs')
