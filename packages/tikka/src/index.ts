import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'

import type { BabelFormat } from 'tikka-transform/src/interface'

export type Options = {
  cwd: string
  format?: BabelFormat[] | Record<BabelFormat, string>
  outDir?: string
  source: string
  babelrc?: string
}

const build = (options: Options) => {
  const { cwd, format, outDir, source, babelrc } = options
  return compile({
    cwd,
    source,
    outDir,
  })
    .tasks(
      transform({
        format,
        transformOptions: babelrc
          ? {
              configFile: babelrc,
            }
          : undefined,
      })
    )
    .run()
}

export { compile, transform }

export default build
