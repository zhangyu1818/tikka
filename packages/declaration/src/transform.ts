import path from 'path'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { Transform } from 'tikka-types/transform'

interface TransformOptions {
  outDir?: string | string[]
  configFile?: string
  compilerOptions?: Record<string, any>
}

const templateConfigPath = path.resolve(__dirname, '..', 'template.tsconfig.json')

const transform: Transform<TransformOptions> =
  (options = {}) =>
  async (state) => {
    const { outDir = '', configFile = 'tsconfig.json', compilerOptions } = options

    const { cwd, source, readFile, outputFile, logger, remove, rootDir } = state

    const outDirs = Array.isArray(outDir)
      ? outDir.map((dir) => path.join(rootDir, dir))
      : [path.join(rootDir, outDir)]

    let tsconfigPath = path.join(cwd, configFile)

    const tscNeedPath = path.join(cwd, 'tsconfig.json')

    if (!existsSync(tsconfigPath)) {
      logger.info('tsconfig file does not exist, use default template tsconfig.json.')
      tsconfigPath = templateConfigPath
    }

    const originalContent = existsSync(tscNeedPath) && (await readFile(tscNeedPath))

    // eslint-disable-next-line global-require,import/no-dynamic-require
    const configOptions = require(tsconfigPath)
    configOptions.compilerOptions = { ...configOptions.compilerOptions, ...compilerOptions }
    configOptions.include = [source]

    // eslint-disable-next-line no-restricted-syntax
    for (const outDir of outDirs) {
      try {
        configOptions.compilerOptions.outDir = outDir

        logger.info(`writing declaration files to ${outDir}...`)

        await outputFile(tscNeedPath, JSON.stringify(configOptions))
        execSync('tsc', { stdio: 'inherit', cwd })

        logger.success('transform declaration success')
      } catch (e) {
        logger.error(e.message)
      } finally {
        if (originalContent) {
          await outputFile(tscNeedPath, originalContent)
        } else {
          await remove(tscNeedPath)
        }
      }
    }
  }

transform.transformer = true

export default transform
