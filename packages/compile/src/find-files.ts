import glob from 'glob'

interface FindFilesOptions {
  source?: string
}

const findFiles = (options: FindFilesOptions = {}): string[] => {
  const { source } = options
  return glob.sync('**/*', {
    cwd: source,
    ignore: '**/{__tests__,__fixtures__,__mocks__,__snapshots__}/**',
    nodir: true,
    absolute: true,
  })
}

export default findFiles
