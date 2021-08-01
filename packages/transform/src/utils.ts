import path from 'path'
import type { TransformState } from 'tikka-types/transform'

import { DEFAULT_BABEL_CONFIG, DEFAULT_TEST, DEFAULT_FORMAT } from './default'

import type { BabelTransformOptions } from './interface'

export const normalizeFormat = (format: BabelTransformOptions['format'], rootDir: string) => {
  if (typeof format === 'string') {
    return {
      [format]: path.join(rootDir, DEFAULT_FORMAT[format]),
    }
  }
  if (Array.isArray(format)) {
    return Object.fromEntries(
      format.map((format) => [format, path.join(rootDir, DEFAULT_FORMAT[format])])
    )
  }
  const normalized = format ?? DEFAULT_FORMAT
  return Object.fromEntries(
    Object.entries(normalized).map(([format, output]) => [format, path.join(rootDir, output)])
  )
}

export const mergeOptions = (options: BabelTransformOptions, state: TransformState<string>) => {
  options.test = options.test ?? DEFAULT_TEST
  options.transformOptions = options.transformOptions ?? DEFAULT_BABEL_CONFIG
  options.format = normalizeFormat(options.format, state.rootDir)

  return { ...state, ...options } as Required<BabelTransformOptions> & TransformState
}
