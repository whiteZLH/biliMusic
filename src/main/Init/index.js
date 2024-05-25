import { updateCookie } from '../common/'
import { biliApi } from '../common'

const request = require('request-promise')
// 当前是使用axios 获得，在后面使用LocalStore 读取以前的配置
function getCookie() {
  request(biliApi.HOME, { resolveWithFullResponse: true })
    .then((body) => {
      let cookies = ''
      for (const cookie of body.headers['set-cookie']) {
        cookies += cookie
        cookies += '; '
      }
      // console.log(body.headers)
      // console.log(cookies)
      updateCookie(cookies)
    })
    .catch((err) => {
      console.log(err)
    })
}
export function initSetting() {
  getCookie()
}
