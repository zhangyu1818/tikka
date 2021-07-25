import path from 'path'

const replaceExt = (filePath: string, ext: string) => {
  const { root, dir, name } = path.parse(filePath)
  return path.format({ root, dir, name, ext })
}

export default replaceExt
