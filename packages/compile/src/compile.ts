import path from 'path'

import { logger } from 'tikka-shared'

import type { Transform, TransformFunc, TransformState } from 'tikka-types/transform'

import findFiles from './find-files'
import { readFile, outputFile, remove, isExist } from './utils'

interface CompileOptions {
  cwd?: string
  source: string
  outDir?: string
}

const isTransformFunc = (transform: any): transform is TransformFunc => !transform.transformer

const compile = (options: CompileOptions) => {
  const { cwd = process.cwd(), source, outDir = '.' } = options

  const absoluteSource = path.join(cwd, source)

  if (!isExist(absoluteSource)) {
    logger.exit('source is not exist')
  }

  const files: string[] = []

  const root = path.join(cwd, outDir)

  const transformState: TransformState = {
    cwd,
    source: absoluteSource,
    files,
    readFile,
    outputFile: outputFile(root),
    relativePath: (filePath) => path.relative(absoluteSource, filePath),
    remove,
    logger,
    outDir,
  }

  const taskQueue: TransformFunc<any>[] = []

  const tasks = (...transforms: (Transform<any> | TransformFunc<any>)[]) => {
    transforms.forEach((transform) => {
      if (isTransformFunc(transform)) {
        taskQueue.push(transform)
      } else {
        taskQueue.push((transform as Transform)())
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return handler
  }

  const run = async () => {
    if (outDir === '.') {
      logger.warn(`outDir is root(.), skip outDir remove`)
    } else {
      logger.info(`clear folder ${outDir}...`)
      await remove(outDir)
    }

    logger.info('searching the files...')

    files.push(...findFiles({ source: absoluteSource }))

    logger.success('files searching completed')

    const queue = [...taskQueue]

    logger.info('running tasks...')

    while (queue.length !== 0) {
      const transform = queue.shift()
      await transform!(transformState)
    }

    logger.success('all tasks running success')
  }

  const handler = { tasks, run }

  return { tasks }
}

export default compile
