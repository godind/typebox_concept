import { runNodeScript, runNpmScript } from '../core/runtime.mjs'

runNpmScript('test:typecheck')
runNpmScript('test')
runNodeScript('staging/converter/cli/check.mjs')
