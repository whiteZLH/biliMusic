import { paramToGetUrl } from '../../utils'
import { biliApi, defaultHeaders } from '../../common'
import { mainWindow } from '../../index'

const rp = require('request-promise')
export async function req(e, data) {
  const url = paramToGetUrl(data.url, data.params)
  return await rp(url, {
    method: data.method,
    headers: {
      ...defaultHeaders
    }
  })
}

export function close() {
  // TODO 需要在setting 中读取然后进行配置， 最小化软件但是不退出
  mainWindow.close()
}
export function min() {
  mainWindow.minimize()
}

export async function getVideoInfo(e, bvid) {
  // 获得 detail 超详细信息
  const detailUrl = paramToGetUrl(biliApi.GET_DETAIL_BY_BVID, { platform: 'web', bvid: bvid })

  let result = await rp(detailUrl, {
    method: 'GET',
    headers: defaultHeaders
  })

  let resultObj = JSON.parse(result)
  // 视频的cid
  const cid = resultObj.data.View.cid
  // 视频的title
  const plaintTitle = resultObj.data.View.title
  // 获得视频所在分 p 的所有分p
  // 存在 分 p
  let allPages = []
  if (resultObj.data.ugc_season) allPages = resultObj.data.View.ugc_season.sections[0].episodes
  // 获得单个page // TODO 屏蔽掉当前分 p 列表的差异
  else allPages = resultObj.View.pages

  // 获得视频流地址
  const url = paramToGetUrl(biliApi.GET_AUDIO_URL, {
    bvid: bvid,
    cid: cid,
    qn: 80,
    fnver: 0,
    fnval: 4048,
    fourk: 1
  })
  result = await rp(url, {
    method: 'GET',
    headers: defaultHeaders
  })
  resultObj = JSON.parse(result)
  const videoInfo = resultObj.data
  // 将所有需要的信息封装到 videoInfo 中
  videoInfo.plaintTitle = plaintTitle
  videoInfo.cid = cid
  videoInfo.allPages = allPages

  return JSON.stringify(videoInfo)
}
