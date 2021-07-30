import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'

export type BabelFormat = 'commonjs' | 'module'

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
