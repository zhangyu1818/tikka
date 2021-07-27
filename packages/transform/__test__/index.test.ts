import path from 'path'
import glob from 'glob'
import { readFileSync } from 'fs-extra'
import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'

const root = path.join(__dirname, '..', 'fixtures')

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

describe('tikka-transform', () => {
  const format = ['commonjs', 'module'] as any[]

  it('should be match js output files', async () => {
    const cwd = path.join(root, 'js')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transform({
          format,
        })
      )
      .run()
    testFilesExpect(cwd)
  })

  it('should be match ts output files', async () => {
    const cwd = path.join(root, 'ts')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transform({
          format,
        })
      )
      .run()
    testFilesExpect(cwd)
  })

  it('should be support babel config file and custom config', async () => {
    const cwd = path.join(root, 'babel-config')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transform({
          format: 'commonjs',
          transformOptions: {
            configFile: path.join(cwd, '.babelrc.js'),
          },
        })
      )
      .run()
    testFilesExpect(cwd)
  })
})
