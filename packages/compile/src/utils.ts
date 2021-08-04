import path from 'path'
import fs from 'fs-extra'

export const isExist = (path: string) => fs.existsSync(path)

export const readFile = (filePath: string) => fs.readFile(filePath, 'utf-8')

export const outputFile = (base: string) => (outputPath: string, data: string, joinBase = true) =>
  fs.outputFile(joinBase ? path.join(base, outputPath) : outputPath, data, 'utf-8')

export const remove = (path: string) => fs.remove(path)
