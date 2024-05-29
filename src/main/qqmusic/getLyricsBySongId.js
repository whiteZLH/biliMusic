import { encryptFunc } from './encrypt'
const rp = require('request-promise')

let data = {
  comm: {
    cv: 4747474,
    ct: 24,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 1
  },
  req_1: {
    module: 'music.musichallSong.PlayLyricInfo',
    method: 'GetPlayLyricInfo',
    param: {
      // "songMID":"000gYjUp2aHqed",
      songID: 202883260
    }
  }
}

export const getLyricsBySongId = async (songId) => {
  if (songId) data.req_1.param.songID = songId
  const timestamp = new Date().getTime()
  const datastr = JSON.stringify(data)
  const sign = encryptFunc(datastr)
  let url = 'https://u6.y.qq.com/cgi-bin/musics.fcg?_=' + timestamp + '&sign=' + sign
  const resultStr = await rp.post(url, { body: datastr })
  const result = JSON.parse(resultStr)

  // BASE64 编码
  const lyric = result.req_1.data.lyric

  // create a buffer
  const buff = Buffer.from(lyric, 'base64')

  // decode buffer as UTF-8
  const str = buff.toString('utf-8')

  // console.log(str)
  // Base64 Encoding in Node.js
  return str
}

