import { runNodeScript, runNpmScript } from '../core/runtime.mjs'

runNodeScript('staging/converter/cli/build.mjs')
runNpmScript('verify:quality-gates:integrity')
runNpmScript('verify:quality-gates:determinism')
