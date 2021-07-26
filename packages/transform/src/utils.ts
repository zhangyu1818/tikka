import type { TransformState } from 'tikka-types/transform'

import { DEFAULT_BABEL_CONFIG, DEFAULT_EXTENSIONS, DEFAULT_FORMAT } from './default'

import type { BabelTransformOptions } from './interface'

export const normalizeFormat = (format: BabelTransformOptions['format']) => {
  if (typeof format === 'string') {
    return {
      [format]: DEFAULT_FORMAT[format],
    }
  }
  return format ?? DEFAULT_FORMAT
}

export const mergeOptions = (options: BabelTransformOptions, state: TransformState) => {
  options.extensions ??= DEFAULT_EXTENSIONS
  options.transformOptions ??= DEFAULT_BABEL_CONFIG
  options.format = normalizeFormat(options.format)

  return { ...state, ...options } as Required<BabelTransformOptions> & TransformState
}
