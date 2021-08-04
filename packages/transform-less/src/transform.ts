import path from 'path'
import less from 'less'
import { toArray } from 'tikka-shared'
import { Transform } from 'tikka-types/transform'

export interface LessTransformOptions {
  test?: RegExp
  exclude?: RegExp
  outputDir?: string | string[]
  inject?: string[]
  filterEmptyOutput?: boolean
  lessOptions?: Less.Options
}

const transformLess: Transform<LessTransformOptions> = (options = {}) => async (state) => {
  const {
    test = /\.less$/,
    outputDir = '',
    filterEmptyOutput = true,
    exclude,
    inject,
    lessOptions,
  } = options

  const { files, readFile, outputFile, relativePath, logger } = state

  const lessFiles = files.filter((filePath) =>
    exclude ? test.test(filePath) && !exclude.test(filePath) : test.test(filePath)
  )

  logger.info(`transform ${lessFiles.length} files with less compiler`)

  const outputDirs = toArray(outputDir)

  // eslint-disable-next-line no-restricted-syntax
  for (const outputDir of outputDirs) {
    logger.info(`output less files to ${outputDir}`)
    // eslint-disable-next-line no-restricted-syntax
    for (const filePath of lessFiles) {
      const { name: filename, base: fileBaseName, dir: fileDir } = path.parse(filePath)
      const compilerOptions: Less.Options = {
        javascriptEnabled: true,
        filename: fileBaseName,
        ...lessOptions,
        paths: [path.dirname(filePath), ...(lessOptions?.paths ?? [])],
      }

      const data = await readFile(filePath)
      const injectedData = inject
        ? // eslint-disable-next-line no-sequences, prefer-template, no-return-assign
          inject.reduce((p, c) => ((p += c + '\n'), p), '') + '\n' + data
        : data
      const { css } = await less.render(injectedData, compilerOptions)

      if (!css && filterEmptyOutput) {
        continue
      }

      const outputPath = path.format({
        root: outputDir,
        dir: relativePath(fileDir),
        name: filename,
        ext: '.css',
      })

      await outputFile(outputPath, css)
    }
  }

  logger.success('less files transform success')
}

transformLess.transformer = true

export default transformLess
