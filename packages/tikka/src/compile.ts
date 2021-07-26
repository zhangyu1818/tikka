import path from 'path'

import { toArray } from 'tikka-shared'

import type { Transform, TransformFunc, TransformState } from 'tikka-types/transform'

import findFiles from './find-files'
import logger from './logger'
import { readFile, outputFile, isExist } from './utils'

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

  const transformState = {
    cwd,
    source: absoluteSource,
    files,
    readFile,
    outputFile,
    logger,
    outDir: toArray(outDir),
  } as TransformState

  const taskQueue: TransformFunc[] = []

  const tasks = (...transforms: (Transform | TransformFunc)[]) => {
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

  const build = async () => {
    logger.info('searching the files...')

    files.push(...findFiles({ source: absoluteSource }))

    logger.success('files searching completed')

    const queue = [...taskQueue]

    logger.info('running tasks...')

    while (queue.length !== 0) {
      const transform = queue.shift()
      await transform!(transformState)
    }
  }

  const handler = { tasks, build }

  return { tasks }
}

export default compile
