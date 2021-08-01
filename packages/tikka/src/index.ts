import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'
import { transformDeclaration } from 'tikka-declaration'

export type BabelFormat = 'commonjs' | 'module'

export type Options = {
  cwd: string
  format?: BabelFormat[] | Record<BabelFormat, string>
  rootDir?: string
  source: string
  babelrc?: string
  declaration?: boolean
}

const build = (options: Options) => {
  const { cwd, format, rootDir, source, babelrc, declaration } = options
  const transforms: any[] = [
    transform({
      format,
      transformOptions: babelrc
        ? {
            configFile: babelrc,
          }
        : undefined,
    }),
    declaration && transformDeclaration,
  ].filter(Boolean)
  return compile({
    cwd,
    source,
    rootDir,
  })
    .tasks(...transforms)
    .run()
}

export { compile, transform }

export default build
