import path from 'path'
import * as swc from '@swc/core'
import { replaceExt } from 'tikka-shared'

import type { Options } from '@swc/core'
import type { Transform } from 'tikka-types/transform'

export type SWCTransformOptions = Options

const transform: Transform<SWCTransformOptions> =
  (options = {}) =>
  async (state) => {
    const { outputPath: outDir = '' } = options
    const { files, outDir: rootOutDir, outputFile, relativePath, logger } = state

    logger.info(`transforming ${files.length} files with SWC`)

    logger.info(`output files to ${outDir || rootOutDir}`)
    // eslint-disable-next-line no-restricted-syntax
    for (const filePath of files) {
      const result = await swc.transformFile(filePath, options)
      if (result) {
        const { code } = result
        const outputPath = replaceExt(path.join(outDir, relativePath(filePath)), '.js')
        await outputFile(outputPath, code ?? '// swc transform empty')
      }
    }

    logger.success(`SWC transform success`)
  }

transform.transformer = true

export default transform
