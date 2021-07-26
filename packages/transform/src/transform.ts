import path from 'path'
import babel from '@babel/core'
import { replaceExt } from 'tikka-shared'

import type { Transform } from 'tikka-types/transform'

import { mergeOptions } from './utils'

import type { BabelTransformOptions, BabelFormat } from './interface'

const transform: Transform<string, BabelTransformOptions> = (options = {}) => async (state) => {
  const {
    source,
    files: baseFiles,
    extensions,
    format: formatConfig,
    outDir,
    outputFile,
    logger,
    transformOptions,
  } = mergeOptions(options, state)

  const files = baseFiles.filter((filePath) => !extensions.some((ext) => filePath.endsWith(ext)))

  logger.info(`transforming ${files.length} files with babel`)

  state.outDir = outDir.flatMap((base) =>
    Object.values(formatConfig).map((dir) => path.join(base, dir))
  )

  // eslint-disable-next-line no-restricted-syntax
  for (const [format, output] of Object.entries(formatConfig)) {
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
        const relativeFilePath = path.relative(source, filePath)
        const outputPath = replaceExt(path.join(output, relativeFilePath), '.js')
        await outputFile(outputPath, code)
      }
    }

    logger.success(`${format} transform success`)
  }

  logger.success(`babel transform success`)
}

transform.transformer = true

export default transform
