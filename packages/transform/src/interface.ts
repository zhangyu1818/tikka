import type { TransformOptions as BabelBasicTransformOptions } from '@babel/core'

export type BabelFormat = 'commonjs' | 'module'

export interface BabelTransformOptions {
  test?: RegExp
  format?: BabelFormat | Partial<Record<BabelFormat, string>>
  transformOptions?:
    | BabelBasicTransformOptions
    | ((format: BabelFormat, filePath: string) => BabelBasicTransformOptions)
}
