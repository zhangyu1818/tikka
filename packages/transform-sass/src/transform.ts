import path from 'path'
import sass from 'sass'
import { toArray } from 'tikka-shared'

import type { Transform } from 'tikka-types/transform'

export interface SassTransformOptions {
  test?: RegExp
  exclude?: RegExp
  outDir?: string | string[]
  emptyOutput?: boolean
  sassOptions?: sass.Options
}

const transformSass: Transform<SassTransformOptions> =
  (options = {}) =>
  async (state) => {
    const {
      test = /\.(scss|sass)$/,
      outDir = '',
      emptyOutput = false,
      exclude,
      sassOptions,
    } = options
    const { files, outDir: rootOutDir, outputFile, relativePath, logger } = state

    const sassFiles = files.filter((filePath) =>
      exclude ? test.test(filePath) && !exclude.test(filePath) : test.test(filePath)
    )

    logger.info(`transform ${sassFiles.length} files with sass compiler`)

    const outputDirs = toArray(outDir)

    // eslint-disable-next-line no-restricted-syntax
    for (const outputDir of outputDirs) {
      logger.info(`output sass files to ${outputDir || rootOutDir}`)
      // eslint-disable-next-line no-restricted-syntax
      for (const filePath of sassFiles) {
        const { name: filename, dir: fileDir } = path.parse(filePath)

        const outputFileName = path.format({ name: filename, ext: '.css' })

        const result = sass.renderSync({
          outFile: outputFileName,
          ...sassOptions,
          file: filePath,
        })

        const css = result.css.toString()

        if (!css && !emptyOutput) {
          continue
        }

        const outputPath = path.format({
          dir: path.join(outputDir, relativePath(fileDir)),
          name: filename,
          ext: '.css',
        })

        await outputFile(outputPath, css)
      }
    }

    logger.success('less files transform success')
  }

transformSass.transformer = true

export default transformSass
