import path from 'path'
import build from 'tikka'
import { testFilesExpect } from 'tikka-shared'

const root = path.resolve(__dirname, '..', 'fixtures')

describe('tikka cli', () => {
  it('build should effective', async () => {
    const cwd = path.join(root, 'build')
    await build({
      cwd,
      source: 'files',
      outDir: 'dist',
      format: {
        commonjs: 'lib',
        module: 'es',
      },
    })
    testFilesExpect(cwd)
  })
})
