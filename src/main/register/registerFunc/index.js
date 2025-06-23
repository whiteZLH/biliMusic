import { paramToGetUrl } from '../../utils'
import { biliApi, defaultHeaders } from '../../common'
import { mainWindow } from '../../index'
import { search, getLyricsBySongId } from '../../qqmusic'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import {
  queryLyricsTimeAlign,
  insertOrUpdateLyricsTimeToDb,
  queryCollectListSavedMetadataFromDb,
  insertCollectListMetadataToDb,
  queryCollectVideosListPage,
  getbiliCollect,
  insertBiliVideoToDb,
  setCollectSyncDb
} from '../../database'
import { log } from 'console'
import { execFile } from 'child_process'
import { json } from 'stream/consumers'

const { webFrame } = require('electron')

// TODO 加入异常控制
const rp = require('request-promise')

export async function req(e, data) {
  //console.log(JSON.stringify(data))
  console.log('data', JSON.stringify(data))
  console.log('defaultHeaders', JSON.stringify(defaultHeaders))
  const url = paramToGetUrl(data.url, data.params)
  let result = await rp(url, { method: data.method, headers: { ...defaultHeaders, Cookie: '' } })
  // console.log('req result:', result)
  return result
}

export function close() {
  // TODO 最小化软件但是不退出
  mainWindow.close()
}

export function min() {
  mainWindow.minimize()
}

export async function getVideoInfo(e, bvid, cid) {
  // 获得 detail 超详细信息
  const detailUrl = paramToGetUrl(biliApi.GET_DETAIL_BY_BVID, { platform: 'web', bvid: bvid })
  // console.log('detailUrl', detailUrl)
  // console.log('defaultHeaders.cookie: ', defaultHeaders.Cookie)
  // console.log('end')
  let result = await rp(detailUrl, { method: 'GET', headers: defaultHeaders })

  // console.log('vedio result', result)
  let resultObj = JSON.parse(result)
  // console.log(result)
  // 视频的cid
  if (!cid || cid === '') cid = resultObj.data.View.cid
  const pic = resultObj.data.View.pic
  // 视频的 title
  // TODO note：Bug 修复 寻找自己分 p 的名字
  let index = 0
  let pages = resultObj.data.View.pages
  for (let i = 0; i < pages.length; i++) {
    if (cid === pages[i].cid) {
      index = i
      break
    }
  }
  // fix: BV1b7421o7vE 例子，视频标题显示问题
  let plaintTitle = resultObj.data.View.pages[index].part
  if (pages.length === 1) {
    plaintTitle = resultObj.data.View.title
    resultObj.data.View.pages[0].part = plaintTitle
  }

  //  console.log(plaintTitle)
  // TODO 对信息的picUrl 进行更改，// -> https://
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
  //TODO https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/player.md 解决分 p 歌曲识别问题
  // 获得当前
  const tagsUrl = paramToGetUrl(biliApi.GET_PLAYER_INFO_BVID_CID, { bvid, cid })
  let tagsResult = await rp(tagsUrl, { method: 'GET', headers: defaultHeaders })
  let tagsResultObj = JSON.parse(tagsResult)
  if (tagsResultObj.data.bgm_info) {
    let bgmInfo = tagsResultObj.data.bgm_info
    musicId = bgmInfo.music_id
    musicName = bgmInfo.music_title
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
    const musicInfo = await rp(musicInfoUrl, { method: 'GET', headers: defaultHeaders })
    const musicInfoObj = JSON.parse(musicInfo)
    musicName = musicInfoObj.data.music_title
    musicOriginArtist = musicInfoObj.data.origin_artist
  } else {
    // console.log('===================')
    musicName = plaintTitle
  }

  //TODO 是否需要进行改变 进行歌词匹配 ? 当前是异步还是同步，
  // 进行歌词的匹配
  // 优先进行数据库匹配, 查找以前保存的歌曲数据
  //
  // console.log(musicName)
  const musicInfos = await search(musicName)
  // console.log(musicInfos)
  // console.log('-------------------')

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
  // 查找当前的songId 是否可以找到对应的timeDiff 偏移，对歌词文件time进行修改 改变offset
  lyrics = await getLyricsBySongId(songId)

  const row = queryLyricsTimeAlign(bvid, cid, songId)
  if (row.length) {
    const timeDiff = row[0].timeDiff
    lyrics = `[timeDiff:` + timeDiff + `]` + lyrics
  }
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
  result = await rp(url, { method: 'GET', headers: defaultHeaders })
  resultObj = JSON.parse(result)
  log(result)
  const videoInfo = resultObj.data
  // 将所有需要的信息封装到 videoInfo 中
  videoInfo.plaintTitle = plaintTitle
  videoInfo.cid = cid
  videoInfo.pic = pic
  videoInfo.allPages = allPages
  videoInfo.musicName = musicName
  videoInfo.musicOriginArtist = musicOriginArtist
  //note: 这两个进行绑定
  videoInfo.lyrics = lyrics
  videoInfo.qqSongId = songId
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

export const saveLyricsTimeToDb = (e, bvid, cid, songId, timeDiff) => {
  insertOrUpdateLyricsTimeToDb(bvid, cid, songId, timeDiff)
}

export const updateTaskbarLyrics = (e, value) => {
  let exePath = join(__dirname, '../../resources/taskbar/taskbar-text.exe')
  // exec taskbar-text.exe
  execFile(exePath, ['-t', value], (error, stdout, stderr) => {})
}

export const searchPersonCollect = async (e, mid) => {
  const collectUrl = paramToGetUrl(biliApi.GET_USER_COLLECT, { up_mid: mid })
  // console.log('detailUrl', detailUrl)
  // console.log('defaultHeaders.cookie: ', defaultHeaders.Cookie)
  // console.log('end')
  let result = await rp(collectUrl, { method: 'GET', headers: defaultHeaders })
  console.log(collectUrl)

  console.log('collect result', result)

  let resultObj = JSON.parse(result)

  let list = resultObj?.data?.list

  if (list) {
    await Promise.all(
      list.map(async (item) => {
        const id = item.id
        const detailUrl = paramToGetUrl(biliApi.GET_COLLECT_DETAIL, { media_id: id })
        const detail = await rp(detailUrl, { method: 'GET', headers: defaultHeaders })
        const detailObj = JSON.parse(detail)
        item.detail = detailObj.data
      })
    )
  } else {
    list = []
    console.error('No collect list found for mid:', mid)
  }

  return JSON.stringify(list)
}

export const saveCollectListMetadata = async (e, collectListJson) => {
  console.log('saveCollectListMetadata', collectListJson)

  // 生成 insert 语句
  let collectList = JSON.parse(collectListJson)

  /* 
  {
      id: crypto.randomUUID(),
      title: item.title,
      cover: item?.detail?.cover,
      bili_collect_id: item.id,
      play_num: item?.detail?.cnt_info?.play,
      up_name: item?.detail?.upper?.name,
      up_mid: item?.detail?.upper?.mid,
      media_count: item?.detail?.media_count
      custom_name: custom_name
    } */
  insertCollectListMetadataToDb(collectList)
}

export const queryCollectListSavedMetadata = () => {
  // 查询保存的收藏夹列表
  let result = queryCollectListSavedMetadataFromDb()
  console.log('queryCollectListSavedMetadata', JSON.stringify(result))
  return JSON.stringify(result)
}

export const queryCollectVideosList = (e, filterJson) => {
  let filetr = JSON.parse(filterJson)

  let result = queryCollectVideosListPage(filetr)

  return JSON.stringify(result)
}

export const getCollectListMetadata = (e, id) => {
  let result = getbiliCollect(id)
  return JSON.stringify(result)
}

export const getCollectVideoListFromBili = async (e, filterJson) => {
  console.log(filterJson)

  let filter = JSON.parse(filterJson)
  let param = {
    media_id: filter.bili_collect_id,
    platform: 'web',
    pn: filter.page_num,
    ps: filter.page_size
  }
  let url = paramToGetUrl(biliApi.GET_COLLECT_VIDEO_LIST, param)
  console.log('getCollectVideoListFromBili url: ', url)

  let data = await rp(url, { method: 'GET' })

  let dataObj = JSON.parse(data)

  let medias = dataObj?.data?.medias ?? []

  let result = medias.map((x) => {
    return {
      collect_id: filter?.bili_collect_id,
      name: x?.title,
      bvid: x?.bvid,
      cid: x?.ugc?.first_cid ?? '',
      pic_url: x?.cover
    }
  })

  return JSON.stringify(result)
}

export const saveCollectVideos = (e, videosJson) => {
  console.log('videosJson', videosJson)

  const videos = JSON.parse(videosJson)
  insertBiliVideoToDb(videos)
}

export const setCollectSync = (e, syncJson) => {
  const sync = JSON.parse(syncJson)

  setCollectSyncDb(sync)
}
