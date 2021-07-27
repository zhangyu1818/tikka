import path from 'path'
import * as babel from '@babel/core'
import { replaceExt } from 'tikka-shared'

import type { Transform } from 'tikka-types/transform'

import { mergeOptions } from './utils'

import type { BabelTransformOptions, BabelFormat } from './interface'

const transform: Transform<BabelTransformOptions> =
  (options = {}) =>
  async (state) => {
    const {
      cwd,
      source,
      files: baseFiles,
      test,
      format: formats,
      outputFile,
      remove,
      logger,
      transformOptions,
    } = mergeOptions(options, state)

    const files = baseFiles.filter((filePath) => test.test(filePath))

    logger.info(`transforming ${files.length} files with babel`)

    state.outDir = Object.values(formats)

    // eslint-disable-next-line no-restricted-syntax
    for (const [format, output] of Object.entries(formats)) {
      logger.info(`start to transform ${format}`)

      await remove(output)
      logger.success(`clean folder ${output}`)

      // eslint-disable-next-line no-restricted-syntax
      for (const filePath of files) {
        const option =
          typeof transformOptions === 'function'
            ? transformOptions(format as BabelFormat, filePath)
            : transformOptions
        const result = await babel.transformFileAsync(filePath, option)
        if (result) {
          const { code } = result
          const relativeFilePath = path.relative(source, filePath)
          const outputBasePath = replaceExt(path.join(output, relativeFilePath), '.js')
          const outputPath = path.join(cwd, outputBasePath)
          await outputFile(outputPath, code)
        }
      }

      logger.success(`${format} transform success`)
    }

    logger.success(`babel transform success`)
  }

transform.transformer = true

export default transform
