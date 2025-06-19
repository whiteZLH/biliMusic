import { defaultHeaders, updateCookie } from '../common/'
import { biliApi } from '../common'
import { checkDatabase } from '../database'
import { paramToGetUrl } from '../utils'

const rp = require('request-promise')
const crypto = require('crypto')

// 当前是使用axios 获得，在后面使用LocalStore 读取以前的配置
function getCookie() {
  // 请求首页获得基础 cookie
  rp(biliApi.HOME, { resolveWithFullResponse: true })
    .then((body) => {
      for (const cookie of body.headers['set-cookie']) {
        let cookieObj = cookie.split('=')
        updateCookie(cookieObj[0])
      }
      //  console.log(cookies)
      // updateCookie(cookies)
      // setSearchCookie(cookies)
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * @param {string} csrf
 */
async function getBiliTicket(csrf) {
  const timestamp = Math.floor(Date.now() / 1000)
  const hexSign = hmacSha256('XgwSnGZ1p', `ts${timestamp}`)
  const param = { key_id: 'ec02', hexsign: hexSign, 'context[ts]': timestamp, csrf: csrf || '' }

  // console.log(JSON.stringify(param))

  let url = paramToGetUrl(biliApi.POST_BiliTicket, param)
  let body = await rp(url, { method: 'POST', headers: defaultHeaders })

  // console.log('POST_BiliTicket: ', JSON.stringify(body))
  let result = JSON.parse(body)
  console.log(typeof result)

  let cookie = `bili_ticket=${result['data'].ticket}; `
  updateCookie(cookie)
}

function hmacSha256(key, message) {
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(message)
  return hmac.digest('hex')
}

async function addBuvid4() {
  let result = await rp(biliApi.GET_buvid4, { method: 'GET', headers: defaultHeaders })

  console.log('buvid4 result', result)
  let resultObj = JSON.parse(result)

  let buvid4 = resultObj.data?.b_4
  let buvid3 = resultObj.data?.b_3
  let cookies = `buvid4=${buvid4}; buvid3=${buvid3};`
  updateCookie(cookies)
}

function addBuvidfp() {
  let cookie = 'buvid_fp=e3d0002bbc685e96b2ba3b4a32832a2c; '
  updateCookie(cookie)
}

export async function initSetting() {
  // 检测数据库
  checkDatabase()
  getCookie()
  // 降低风控概率 https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/v_voucher.md
  await getBiliTicket('') // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/bili_ticket.md
  addBuvid4() // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/buvid3_4.md
  addBuvidfp() // https://github.com/SocialSisterYi/bilibili-API-collect/issues/1022
  // https://github.com/SocialSisterYi/bilibili-API-collect/issues/933
}
// buvid_fp!!! 没有会触发风控
// https://github.com/SocialSisterYi/bilibili-API-collect/issues/933#issue-2073916390
// https://github.com/kingwingfly/fav/blob/489ac35e1ee17fe7ebb3748274eec789b4247631/src/api/auth/active.rs#L102
// rs webassmly
// 检查数据库
