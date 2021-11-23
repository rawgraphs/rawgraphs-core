const PREFIX = "__RAWLazyT:"

export function t(s) {
  return String(PREFIX + s)
}

export function isRAWLazyT(s) {
  return String(s).indexOf(PREFIX) === 0
}

export function valueOfRAWLazyT(s) {
  return isRAWLazyT(s) ? s.replace(PREFIX, '') : s
}
