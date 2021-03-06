import path from 'path'
import { compile } from 'tikka-compile'
import { transform } from 'tikka-transform'
import { testFilesExpect } from 'tikka-shared'

const root = path.join(__dirname, '..', 'fixtures')

describe('tikka-transform', () => {
  it('should be match js output files', async () => {
    const cwd = path.join(root, 'js')
    await compile({
      cwd,
      source: 'files',
      outDir: 'dist',
    })
      .tasks(
        transform({
          format: {
            commonjs: 'lib',
            module: 'es',
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
          format: {
            commonjs: 'lib',
            module: 'es',
          },
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
