import fs from 'fs-extra'

export const isExist = (path: string) => fs.existsSync(path)

export const readFile = (filePath: string) => fs.readFile(filePath, 'utf-8')

export const outputFile = (outputPath: string, data: string) =>
  fs.outputFile(outputPath, data, 'utf-8')
