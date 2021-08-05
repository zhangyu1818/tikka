import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'
import { transformDeclaration } from 'tikka-declaration'
import { transformLess } from 'tikka-transform-less'

export type BabelFormat = 'commonjs' | 'module'

export type Options = {
  cwd: string
  format?: Record<BabelFormat, string>
  rootDir?: string
  source: string
  babelrc?: string
  declaration?: boolean
}

const build = (options: Options) => {
  const { cwd, format, source, rootDir, babelrc, declaration } = options

  const outDir = format && Object.keys(format)

  const transforms: any[] = [
    transform({
      format,
      transformOptions: babelrc
        ? {
            configFile: babelrc,
          }
        : undefined,
    }),
    declaration && transformDeclaration({ outDir }),
    transformLess({ outDir }),
  ].filter(Boolean)
  return compile({
    cwd,
    source,
    outDir: rootDir,
  })
    .tasks(...transforms)
    .run()
}

export { compile, transform, transformDeclaration }

export default build
