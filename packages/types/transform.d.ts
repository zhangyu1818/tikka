import type { Logger } from './logger'

export interface TransformState<T = unknown> {
  readFile: (filePath: string) => Promise<T>
  outputFile: (outputPath: string, data: T) => Promise<void>
  remove: (path: string) => Promise<void>
  cwd: string
  source: string
  files: string[]
  logger: Logger
  outDir: string[]
}

export type TransformFunc<T = unknown> = (state: TransformState<T>) => void | Promise<void>

export interface Transform<T = unknown, U = any> {
  (options?: T): TransformFunc<U>
  transformer: boolean
}
