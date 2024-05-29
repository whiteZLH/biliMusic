const rp = require('request-promise')
import { encryptFunc } from './encrypt'

''
let data = {
  comm: {
    _channelid: '0',
    _os_version: '6.2.9200-2',
    authst: '',
    ct: '19',
    cv: '2013',
    //    "guid" : "F14180226870FF75CBC614A4DA27E4BF",
    patch: '118',
    psrf_access_token_expiresAt: 0,
    psrf_qqaccess_token: '',
    psrf_qqopenid: '',
    psrf_qqunionid: '',
    tmeAppID: 'qqmusic',
    tmeLoginType: 0,
    uin: '0'
    //    "wid" : "4581210960133325824"
  },
  'music.search.SearchCgiService': {
    method: 'DoSearchForQQMusicDesktop',
    module: 'music.search.SearchCgiService',
    param: {
      grp: 1,
      num_per_page: 40,
      page_num: 1,
      query: '',
      remoteplace: 'txt.newclient.top',
      search_type: 0
      //   "searchid" : "3538C60449BD46B28FF0C4F14B5F09A608746"
    }
  }
}
let headers = {
  // 'Host': 'u6.y.qq.com',
  Accept: 'application/json',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  Origin: 'https://y.qq.com',
  Pragma: 'no-cache',
  Referer: 'https://y.qq.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
  'Content-Type': 'text/plain',
  method: 'POST'
}

export const search = async (query) => {
  data['music.search.SearchCgiService'].param.query = query
  const timestamp = new Date().getTime()
  let datastr = JSON.stringify(data)
  const sign = encryptFunc(datastr)
  let url = 'https://u6.y.qq.com/cgi-bin/musics.fcg?_=' + timestamp + '&sign=' + sign
  const resultstr = await rp.post(url, { headers, body: datastr })
  const result = JSON.parse(resultstr)
  let infos = []
  const infoList = result['music.search.SearchCgiService'].data.body.song.list
  for (const info of infoList) {
    const musicName = info.name
    const singerName = info.singer[0].name
    const songId = info.id
    infos.push({
      musicName,
      singerName,
      songId
    })
  }
  return infos
}
