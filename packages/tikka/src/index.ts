import autoprefixer from 'autoprefixer'

import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'
import { transformDeclaration } from 'tikka-declaration'
import { transformLess } from 'tikka-transform-less'
import { transformSass } from 'tikka-transform-sass'
import { withPostcss } from 'tikka-with-postcss'

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

  const outDir = format && Object.values(format)

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
    withPostcss([transformLess({ outDir }), transformSass({ outDir })], {
      plugins: [autoprefixer],
    }),
  ].filter(Boolean)
  return compile({
    cwd,
    source,
    outDir: rootDir,
  })
    .tasks(...transforms)
    .run()
}

export { compile, transform, transformDeclaration, transformLess, transformSass, withPostcss }

export default build
