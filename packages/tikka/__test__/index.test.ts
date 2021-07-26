import { compile } from 'tikka'
import path from 'path'
import { existsSync } from 'fs-extra'

import type { Transform, TransformState } from 'tikka-types/transform'

interface EmptyTransformOption {
  cb: (state: TransformState) => void
}
const emptyTransform: Transform<EmptyTransformOption> = (options) => async (state) => {
  await options?.cb(state)
}
emptyTransform.transformer = true

const cwd = path.join(__dirname, '..')

describe('tikka', () => {
  it('should be able to search all files', async () => {
    await compile({ cwd, source: '__test__' })
      .tasks(
        emptyTransform({
          cb: (state) => {
            expect(state.cwd).toBe(cwd)
            expect(state.source).toBe(path.join(cwd, '__test__'))
            expect(state.outDir).toEqual(['.'])
            expect(state.files.length).toBe(1)
            expect(state.readFile).toBeDefined()
            expect(state.outputFile).toBeDefined()
            expect(state.remove).toBeDefined()
            expect(state.logger).toBeDefined()
          },
        })
      )
      .run()
  })

  it('should be called simple transform', async () => {
    const fn = jest.fn()
    const transform: Transform = () => fn
    transform.transformer = true

    await compile({ cwd, source: '__test__' }).tasks(transform).run()

    expect(fn).toBeCalled()
  })

  it('should output file, read file and delete file', async () => {
    await compile({ cwd, source: '__test__' })
      .tasks(
        emptyTransform({
          cb: async (state) => {
            const outputPath = path.join(cwd, '__test__/temp-file')
            await state.outputFile(outputPath, 'temp file')
            const content = await state.readFile(outputPath)
            expect(content).toBe('temp file')
            await state.remove(outputPath)
            expect(existsSync(outputPath)).toBeFalsy()
          },
        })
      )
      .run()
  })
})
