import path from 'path'
import babel from '@babel/core'
import { replaceExt } from 'tikka-shared'

import type { TransformOptions as BabelBasicTransformOptions } from '@babel/core'
import type { Transform, TransformOptions } from 'tikka-types/transform'

import { mergeOptions } from './utils'

export type BabelFormat = 'commonjs' | 'module'

export interface BabelTransformOptions extends TransformOptions<string> {
  format?: BabelFormat | Partial<Record<BabelFormat, string>>
  transformOptions?:
    | BabelBasicTransformOptions
    | ((format: BabelFormat) => BabelBasicTransformOptions)
}

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

  const files = baseFiles.filter((filePath) => extensions.every((ext) => !filePath.endsWith(ext)))

  logger.info(`transforming ${files.length} files with babel`)

  state.outDir = [...new Set([...outDir, ...Object.values(formatConfig)])]

  // eslint-disable-next-line no-restricted-syntax
  for (const [format, output] of Object.entries(formatConfig)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const filePath of files) {
      const option =
        typeof transformOptions === 'function'
          ? transformOptions(format as BabelFormat)
          : transformOptions
      const result = await babel.transformFileAsync(filePath, option)
      if (result) {
        const { code } = result
        const relativeFilePath = path.relative(source, filePath)
        const outputPath = replaceExt(path.join(output, relativeFilePath), '.js')
        await outputFile(outputPath, code)
      }
    }
  }

  logger.success(`transform success`)
}

transform.transformer = true
