import postcss from 'postcss'

import type { AcceptedPlugin, ProcessOptions } from 'postcss'

import type { Transform, TransformFunc, TransformPlugin } from 'tikka-types/transform'

export type WithPostcssOptions = {
  plugins?: AcceptedPlugin[]
  options?: ProcessOptions
}

const isTransformer = (transform: any): transform is Transform => transform.transformer

const withPostcss: TransformPlugin<WithPostcssOptions> = (transforms, options = {}) => async (
  state
) => {
  const transformsFunc: TransformFunc[] = transforms.map((transform) =>
    isTransformer(transform) ? transform() : transform
  )

  const { outputFile } = state

  const { plugins, options: processOptions } = options

  const outputWithPostcss: typeof outputFile = async (outputPath, data, joinBase) => {
    const { css } = await postcss(plugins).process(data, { from: undefined, ...processOptions })
    await outputFile(outputPath, css, joinBase)
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const transformFunc of transformsFunc) {
    await transformFunc({ ...state, outputFile: outputWithPostcss })
  }
}

export default withPostcss
