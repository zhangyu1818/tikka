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
      files: baseFiles,
      test,
      format: formats,
      outputFile,
      relativePath,
      logger,
      transformOptions,
    } = mergeOptions(options, state)

    const files = baseFiles.filter((filePath) => test.test(filePath))

    logger.info(`transforming ${files.length} files with babel`)

    // eslint-disable-next-line no-restricted-syntax
    for (const [format, output] of Object.entries(formats)) {
      logger.info(`start to transform ${format}`)

      // eslint-disable-next-line no-restricted-syntax
      for (const filePath of files) {
        const option =
          typeof transformOptions === 'function'
            ? transformOptions(format as BabelFormat, filePath)
            : transformOptions
        const result = await babel.transformFileAsync(filePath, option)
        if (result) {
          const { code } = result
          const outputPath = replaceExt(path.join(output, relativePath(filePath)), '.js')
          await outputFile(outputPath, code ?? '// babel transform empty')
        }
      }

      logger.success(`${format} transform success`)
    }

    logger.success(`babel transform success`)
  }

transform.transformer = true

export default transform
