import type { Logger } from './logger'

export interface TransformState<T = unknown> {
  readFile: (filePath: string) => Promise<T>
  outputFile: (outputPath: string, data: T) => Promise<void>
  remove: (path: string) => Promise<void>
  cwd: string
  source: string
  files: string[]
  logger: Logger
  rootDir: string
  // [key: string]: any
}

export type TransformFunc<T = unknown> = (state: TransformState<T>) => void | Promise<void>

export interface Transform<T = unknown, U = any> {
  transformer: boolean

  (options?: T): TransformFunc<U>
}
