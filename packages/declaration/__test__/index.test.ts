import { compile } from 'tikka-compile'
import { transformDeclaration } from 'tikka-declaration'
import path from 'path'
import { testFilesExpect } from 'tikka-shared'

describe('transform declaration', () => {
  it('should output declaration files', async () => {
    const cwd = path.resolve(__dirname, '..', 'fixtures')
    await compile({ cwd, source: 'files', rootDir: 'dist' }).tasks(transformDeclaration).run()
    testFilesExpect(cwd)
  })
})
