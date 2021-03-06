#!/usr/bin/env node

/* eslint-disable global-require,no-console */
import parser from 'yargs-parser'
import { existsSync } from 'fs-extra'
import { logger } from 'tikka-shared'

import build from './index'

import type { BabelFormat } from './index'

type Args = {
  cwd?: string
  format?: BabelFormat[]
  outDir?: string[]
  source?: string
  version?: boolean
  babelrc?: string
  declaration?: boolean
}

const argv = parser(process.argv.slice(2), {
  array: ['format', 'outDir'],
  alias: {
    version: ['v'],
    declaration: ['d'],
  },
  configuration: {
    'camel-case-expansion': false,
  },
}) as Args

if (argv.version) {
  // eslint-disable-next-line global-require,no-console
  console.log(require('../package.json').version)
  process.exit(0)
}

if (!argv.source) {
  logger.exit('source is required. example: --source src.')
}

if (Array.isArray(argv.format) && Array.isArray(argv.outDir)) {
  if (argv.format.length !== argv.outDir.length) {
    logger.exit(
      'oudDir params amount should match format params amount. example: --format commonjs --outDir lib.'
    )
  }
  argv.format = Object.fromEntries(argv.format.map((format, i) => [format, argv.outDir![i]])) as any
}

if (argv.babelrc) {
  if (!existsSync(argv.babelrc)) {
    logger.exit('babel config file not exist, example --babelrc babel.config.js')
  }
}

if (!argv.cwd) {
  argv.cwd = process.cwd()
}

const { cwd, source, format, babelrc, declaration } = argv as unknown as Required<
  Omit<Args, 'format'> & {
    format: Record<BabelFormat, string>
  }
>

build({ cwd, source, format, babelrc, declaration }).catch((e) => {
  logger.exit(e.message)
})
