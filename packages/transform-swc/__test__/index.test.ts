import path from 'path'
import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform-swc'
import { testFilesExpect } from 'tikka-shared'

const root = path.join(__dirname, '..', 'fixtures')

describe('tikka-transform-swc', () => {
  it('should be match js output files', async () => {
    const cwd = path.join(root, 'js')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transform({
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
          },
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
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        })
      )
      .run()
    testFilesExpect(cwd)
  })
})
