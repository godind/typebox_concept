import { runNodeScript, runNpmScript } from '../core/runtime.mjs'

runNodeScript('staging/converter/cli/build.mjs')
runNpmScript('verify:phase4:integrity')
runNpmScript('verify:phase4:determinism')
