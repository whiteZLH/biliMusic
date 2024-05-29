let info = {}

export let timeArr = []

export function loadLyricsText(text) {
  timeArr = []
  const linesReg = /\[.+]( )?(.+)?/g
  const tagsReg = /\[(ti|ar|al|by|offset):((.+)?)]/g
  const lyricsReg = /\[\d+:\d+\.\d+]+/g
  const lines = text.match(linesReg)
  for (const line of lines) {
    // 处理信息
    const index = line.search(tagsReg)
    if (index !== -1) {
      const temp = line.substring(1, line.length - 1)
      const [name, content] = temp.split(':')
      info[name] = content
      if (name === 'offset') info[name] = parseInt(content)
    }

    // 处理歌词 将所有的都变为Timestamp 仅仅是qq 音乐
    const temp = line.match(lyricsReg)
    const lyrics = line.replace(lyricsReg, '')
    if (lyrics === '') continue
    if (temp) {
      for (const timeText of temp) {
        const time = getTimestampFromLyrics(timeText)
        timeArr.push({ time: time, line: lyrics })
      }
    }
  }
  console.log(timeArr, '========')

  timeArr.sort((a, b) => a.time < b.time)
}

const getTimestampFromLyrics = (text) => {
  const reg = /\d+:\d+.\d+/g
  const timeText = text.match(reg)[0]
  // console.log(timeText,text)
  const timeArray = timeText.split(/([.:])/g)
  // console.log(timeArray)
  let timestamp = 0
  timestamp += parseInt(timeArray[0]) * 60
  timestamp += parseInt(timeArray[2])
  timestamp *= 1000
  // console.log(timeArr[2])
  while (timeArray[4].length < 3) {
    timeArray[4] += '0'
  }
  timestamp += parseInt(timeArray[4])

  return timestamp
}
