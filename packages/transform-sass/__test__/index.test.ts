import path from 'path'
import { compile } from 'tikka-compile'
import { transformSass } from 'tikka-transform-sass'
import { testFilesExpect } from 'tikka-shared'

const root = path.join(__dirname, '..', 'fixtures')

describe('transformSass', () => {
  it('should be match expect files', async () => {
    const cwd = path.join(root, 'scss')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(transformSass)
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
        transformSass({
          outDir: 'output',
        })
      )
      .run()

    testFilesExpect(cwd)
  })
})
