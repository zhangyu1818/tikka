import type { TransformState } from 'tikka-types/transform'

import { DEFAULT_BABEL_CONFIG, DEFAULT_TEST, DEFAULT_FORMAT } from './default'

import type { BabelTransformOptions } from './interface'

export const normalizeFormat = (format: BabelTransformOptions['format']) => {
  if (typeof format === 'string') {
    return {
      [format]: DEFAULT_FORMAT[format],
    }
  }
  if (Array.isArray(format)) {
    return Object.fromEntries(format.map((format) => [format, DEFAULT_FORMAT[format]]))
  }
  return format ?? DEFAULT_FORMAT
}

export const mergeOptions = (options: BabelTransformOptions, state: TransformState) => {
  options.test = options.test ?? DEFAULT_TEST
  options.transformOptions = options.transformOptions ?? DEFAULT_BABEL_CONFIG
  options.format = normalizeFormat(options.format)

  return { ...state, ...options } as Required<BabelTransformOptions> & TransformState
}
