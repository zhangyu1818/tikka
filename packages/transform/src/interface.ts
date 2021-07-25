import type { TransformOptions } from 'tikka-types/transform'
import type { TransformOptions as BabelBasicTransformOptions } from '@babel/core'

export type BabelFormat = 'commonjs' | 'module'

export interface BabelTransformOptions extends TransformOptions<string> {
  format?: BabelFormat | Partial<Record<BabelFormat, string>>
  transformOptions?:
    | BabelBasicTransformOptions
    | ((format: BabelFormat, filePath: string) => BabelBasicTransformOptions)
}
