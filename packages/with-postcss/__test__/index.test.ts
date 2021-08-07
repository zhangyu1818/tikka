import path from 'path'
import { compile } from 'tikka-compile'
import { transformLess } from 'tikka-transform-less'
import { transformSass } from 'tikka-transform-sass'
import { withPostcss } from 'tikka-with-postcss'
import { testFilesExpect } from 'tikka-shared'

import autoprefixer from 'autoprefixer'

describe('tikka with postcss', () => {
  it('should work', async () => {
    const cwd = path.join(__dirname, '..', 'fixtures')
    await compile({ cwd, source: 'files', outDir: 'dist' })
      .tasks(
        withPostcss([transformLess({ outDir: 'less' }), transformSass({ outDir: 'sass' })], {
          plugins: [autoprefixer({ overrideBrowserslist: ['last 2 versions'] })],
        })
      )
      .run()

    testFilesExpect(cwd)
  })
})
