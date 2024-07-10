import { paramToGetUrl } from '../../utils'
import { biliApi, defaultHeaders } from '../../common'
import { mainWindow } from '../../index'
import { search, getLyricsBySongId } from '../../qqmusic'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import fs from 'fs'
// import { webFrame } from 'electron'
const { webFrame } = require('electron')

// TODO 加入异常控制
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
  // console.log(result)
  // 视频的cid
  const cid = resultObj.data.View.cid
  // 视频的 title
  const plaintTitle = resultObj.data.View.pages[0].part
  // console.log(plaintTitle)
  // 获得视频所在分 p 的所有分p
  // 存在 分 p
  let allPages = []
  // 合集 每个都有自己的 bvid
  if (resultObj.data.View.ugc_season) allPages = resultObj.data.View.ugc_season.sections[0].episodes
  // 这个是分 p 获得分 p 的数据
  // 确保
  else {
    allPages = resultObj.data.View.pages
    for (let page of allPages) {
      page.bvid = bvid
      page.title = page.part
    }
  }
  // console.log(JSON.stringify(allPages))
  // 获得单个page // TODO 屏蔽掉当前分 p 列表的差异
  // 视频背景音音乐
  let musicId = ''
  let musicName = ''
  // 原唱名字
  let musicOriginArtist = ''
  for (const tag of resultObj.data.Tags) {
    if (tag.tag_type === 'bgm') {
      musicId = tag.music_id
      musicName = tag.tag_name
    }
  }
  if (musicName === '') {
    let start = musicName.search('《')
    let end = musicName.search('》')
    if (start !== -1 && end !== -1) musicName.substring(start, end)
  }
  // console.log(musicId)
  // 如果成功获得了musicId，请求music信息
  if (musicId) {
    // 获得 musicInfoUrl
    const musicInfoUrl = paramToGetUrl(biliApi.GET_BGM_INFO_BY_MUSICID, { music_id: musicId })
    const musicInfo = await rp(musicInfoUrl, {
      method: 'GET',
      headers: defaultHeaders
    })
    const musicInfoObj = JSON.parse(musicInfo)
    musicName = musicInfoObj.data.music_title
    musicOriginArtist = musicInfoObj.data.origin_artist
  } else {
    console.log('===================')
    musicName = plaintTitle
  }

  //TODO 是否需要进行改变 进行歌词匹配 ? 当前是异步还是同步，
  // 进行歌词的匹配
  console.log(musicName)
  const musicInfos = await search(musicName)
  console.log(musicInfos)
  console.log('-------------------')

  let songId
  // 优先匹配title 寻找最为匹配的歌曲
  // 使用了pages[0].part
  for (let musicInfo of musicInfos) {
    if (plaintTitle.includes(musicInfo.musicName) && plaintTitle.includes(musicInfo.singerName)) {
      songId = musicInfo.songId
      break
    }
  }
  let lyrics
  // 找到了歌曲信息，但没有完全匹配的歌曲信息，默认选择第一个
  if (!songId && musicInfos.length) {
    songId = musicInfos[0].songId
  }
  lyrics = await getLyricsBySongId(songId)

  // 没找到歌曲
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
  videoInfo.musicName = musicName
  videoInfo.musicOriginArtist = musicOriginArtist
  videoInfo.lyrics = lyrics
  /*
   *allpage:page: {
   * cid,bvid,title
   * }
   */
  return JSON.stringify(videoInfo)
}

export function clearCache() {
  webFrame.clearCache()
}

export const openLyricsWindow = async () => {}

export const getPathAndUrl = () => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    return process.env['ELECTRON_RENDERER_URL'] + '/rendererLyrics/'
  } else {
    return join(__dirname, '../renderer/rendererLyrics/index.html')
  }
}
