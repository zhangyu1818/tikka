import type { Logger } from './logger'

export interface TransformState<T = string> {
  readFile: (filePath: string) => Promise<T>
  outputFile: (outputPath: string, data: T, joinBase?: boolean) => Promise<void>
  remove: (path: string) => Promise<void>
  relativePath: (filePath: string) => string
  cwd: string
  source: string
  files: string[]
  logger: Logger
  outDir: string
  // [key: string]: any
}

export type TransformFunc<T = unknown> = (state: TransformState<T>) => void | Promise<void>

export interface Transform<T = unknown, U = string> {
  transformer: boolean

  (options?: T): TransformFunc<U>
}
