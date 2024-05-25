export function paramToGetUrl(url, param) {
  let times = 0
  for (const k in param) {
    if (times === 0) url += '?'
    else url += '&'
    url += k
    url += '='
    url += encodeURI(param[k])
    times++
  }
  return url
}
