import chalk from 'chalk'

import type { Logger } from 'tikka-types/logger'

// eslint-disable-next-line prefer-destructuring, no-console
const log = console.log

const print =
  (prefix: string, color: chalk.Chalk) =>
  (...messages: string[]) =>
    log(color(chalk.bold(prefix)), ...messages)

const logger: Logger = {
  info: print('ℹ️', chalk.blue),
  warn: print('⚠️', chalk.yellow),
  success: print('✅', chalk.green),
  error: print('❌', chalk.red),
  exit: (...message) => {
    logger.error(...message)
    process.exit(1)
  },
}

export default logger
