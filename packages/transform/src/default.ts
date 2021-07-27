import type { TransformOptions } from '@babel/core'
import type { BabelFormat } from './interface'

export const DEFAULT_TEST = /\.(js|jsx|ts|tsx)$/

export const DEFAULT_FORMAT = {
  commonjs: 'lib',
  module: 'es',
} as const

export const DEFAULT_BABEL_CONFIG = (format: BabelFormat, filePath: string): TransformOptions => {
  const isTSX = filePath.endsWith('.tsx')
  return {
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX,
          allExtensions: isTSX,
        },
      ],
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          modules: format === 'module' ? false : 'auto',
          targets: {
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
          },
        },
      ],
    ],
    sourceType: 'unambiguous',
  }
}
