import glob from 'glob'
import { readFileSync } from 'fs-extra'

const testFilesExpect = (path: string) => {
  const expectFiles = glob.sync('expect/**/*', { cwd: path, nodir: true, absolute: true })
  const distFiles = glob.sync('dist/**/*', { cwd: path, nodir: true, absolute: true })
  expect(expectFiles.length).toEqual(distFiles.length)
  for (let i = 0, len = expectFiles.length; i < len; i++) {
    const expectFilePath = expectFiles[i]
    const distFilePath = distFiles[i]
    const expectFileContent = readFileSync(expectFilePath, 'utf-8')
    const distFileContent = readFileSync(distFilePath, 'utf-8')
    expect(distFileContent.trim()).toBe(expectFileContent.trim())
  }
}

export default testFilesExpect
