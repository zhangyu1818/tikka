export type Log = (message: string) => void

export type Logger = {
  info: Log
  warn: Log
  success: Log
  error: Log
  exit: Log
}
