import type { Logger } from './logger'

export interface TransformOptions<T = any> {
  extensions?: string[]
  readFile?: (filePath: string) => T | Promise<T>
  outputFile?: (outputPath: string, data: T) => void | Promise<void>
}

export interface TransformState<T = any> extends Required<TransformOptions<T>> {
  cwd: string
  source: string
  files: string[]
  logger: Logger
  outDir: string[]
}

export type TransformFunc<T = any> = (state: TransformState<T>) => void | Promise<void>

export interface Transform<T = any, U extends TransformOptions<T> = TransformOptions<T>> {
  (options?: U): TransformFunc<T>
  transformer: boolean
}
