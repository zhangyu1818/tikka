const toArray = <T>(param?: T | T[]) => {
  if (Array.isArray(param)) {
    return param
  }
  return param === undefined ? [] : [param]
}

export default toArray
