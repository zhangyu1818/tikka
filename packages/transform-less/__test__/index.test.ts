import path from 'path'
import { compile } from 'tikka-compile'
import { transformLess } from 'tikka-transform-less'
import { testFilesExpect } from 'tikka-shared'

const root = path.join(__dirname, '..', 'fixtures')

describe('transformLess', () => {
  it('should be match expect files', async () => {
    const cwd = path.join(root, 'less')
    await compile({
      cwd,
      source: 'files',
      outDir: 'expect',
    })
      .tasks(transformLess)
      .run()

    testFilesExpect(cwd)
  })

  it('should be exclude files', async () => {
    const cwd = path.join(root, 'exclude')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transformLess({
          exclude: /\.exclude.less$/,
        })
      )
      .run()

    testFilesExpect(cwd)
  })

  it('should be support inject data', async () => {
    const cwd = path.join(root, 'inject')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transformLess({
          inject: ['@import "./theme";'],
        })
      )
      .run()

    testFilesExpect(cwd)
  })

  it('should be support outDir', async () => {
    const cwd = path.join(root, 'outDir')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transformLess({
          outDir: 'output',
        })
      )
      .run()

    testFilesExpect(cwd)
  })
})
