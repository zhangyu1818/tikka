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
      outDir: 'dist',
    })
      .tasks(transformLess)
      .run()

    testFilesExpect(cwd)
  })
})
