export const biliApi = {
  // SEARCH :'/x/web-interface/wbi/search/all/v2?keyword={{keyword}}',
  HOME: 'https://www.bilibili.com',
  SEARCH: 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2',
  // SEARCH :'/abc/x/web-interface/wbi/search/all/v2',
  GET_VIDEO_INFO_BY_BVID: 'https://api.bilibili.com/x/web-interface/view',
  GET_AUDIO_URL: 'https://api.bilibili.com/x/player/wbi/playurl', //fnval 为视频格式，这里使用dash格式
  GET_CID_BY_BVID: 'https://api.bilibili.com/x/player/pagelist',
  GET_DETAIL_BY_BVID: 'https://api.bilibili.com/x/web-interface/wbi/view/detail'
}

export let defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
  // 在initSetting 里加入Cookie
  'Content-Type': 'application/json; charset=utf-8',
  Referer: 'https://www.bilibili.com',
  Cookie: ''
}

export function updateCookie(cookie) {
  defaultHeaders['Cookie'] = cookie
}
