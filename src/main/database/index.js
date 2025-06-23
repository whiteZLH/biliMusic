import { app } from 'electron'

let dbCache
const Database = require('better-sqlite3')

const filePath = app.getPath('userData') + '/bili.data.db'

export function getDb() {
  if (!dbCache) {
    // dbCache = await AsyncDatabase.open('data.db')
    console.log('open database: ' + filePath)

    dbCache = new Database(filePath, { verbose: console.log })
  }
  return dbCache
}

export function checkDatabase() {
  // 检查当前是否具有数据库 sqllite3
  const db = getDb()
  // 没有则创建歌词时间对齐数据库
  // @ts-ignore
  const SQL_CREATE_LYRICS_TIME_ALIGN_TABLE = `CREATE TABLE IF NOT EXISTS "lyrics_time_align" (
  "bvid" text NOT NULL,
  "cid" text NOT NULL,
  "songId" text NOT NULL,
  "timeDiff" real,
  PRIMARY KEY ("bvid", "cid", "songId")
);`

  // @ts-ignore
  const SQL_CREATE_BILI_COLLECT_TABLE = ` CREATE TABLE  IF NOT EXISTS bili_collect (
    id          TEXT not null
        primary key,
    title       TEXT,
    cover       TEXT,
    bili_collect_id    TEXT,
    play_num    INTEGER,
    up_name     TEXT,
    up_mid      INTEGER,
    media_count INTEGER,
    custom_name TEXT,
    sync        INTEGER
);
`

  const SQL_CREATE_MAPPING_COLLECT_VIDEO_TABLE = `CREATE TABLE IF NOT EXISTS mapping_collect_video (
    id         TEXT PRIMARY KEY,
    collect_id TEXT,
    video_id   TEXT
);
`

  const SQL_CREATE_BILI_VIDEO_TABLE = `CREATE TABLE IF NOT EXISTS bili_video (
    id         TEXT,
    collect_id TEXT,
    name       TEXT,
    bvid       TEXT,
    cid        TEXT,
    pic_url    TEXT
);
`
  // 创建设置配置数据库
  db.exec(SQL_CREATE_LYRICS_TIME_ALIGN_TABLE)
  // 创建收藏夹数据库
  db.exec(SQL_CREATE_BILI_COLLECT_TABLE)
  // 创建映射数据库
  db.exec(SQL_CREATE_MAPPING_COLLECT_VIDEO_TABLE)
  // 创建视频数据库
  db.exec(SQL_CREATE_BILI_VIDEO_TABLE)

  console.log('check database finish.')
  return filePath
}

export function insertLyricsTimeToDb(bvid, cid, songId, timeDiff) {
  bvid = bvid + ''
  cid = cid + ''
  songId = songId + ''
  const db = getDb()
  // 保存设置
  const SQL_INSERT_LYRICS_TIME_ALIGN = `INSERT INTO "lyrics_time_align" VALUES (@bvid, @cid, @songId, @timeDiff);`
  const insert_stmt = db.prepare(SQL_INSERT_LYRICS_TIME_ALIGN)

  insert_stmt.run({ bvid, cid, songId, timeDiff })
}

export function insertOrUpdateLyricsTimeToDb(bvid, cid, songId, timeDiff) {
  if (existLyricsTime(bvid, cid, songId)) {
    updateLyricsTimeToDb(bvid, cid, songId, timeDiff)
  } else {
    insertLyricsTimeToDb(bvid, cid, songId, timeDiff)
  }
}

export function existLyricsTime(bvid, cid, songId) {
  const row = queryLyricsTimeAlign(bvid, cid, songId)
  return row.length > 0
}

export function updateLyricsTimeToDb(bvid, cid, songId, timeDiff) {
  bvid = bvid + ''
  cid = cid + ''
  songId = songId + ''

  const db = getDb()
  // 保存设置
  const SQL_UPDATE_LYRICS_TIME_ALIGN = `UPDATE lyrics_time_align SET timeDiff = @timeDiff WHERE bvid = @bvid AND  cid = @cid AND songId = @songId;`
  const insert_stmt = db.prepare(SQL_UPDATE_LYRICS_TIME_ALIGN)

  insert_stmt.run({ bvid, cid, songId, timeDiff })
}

// 根据bvid, cid, songId 查询timeDiff 使用get
export function queryLyricsTimeAlign(bvid, cid, songId) {
  bvid = bvid + ''
  cid = cid + ''
  songId = songId + ''

  const db = getDb()
  const GET_LYRICS_TIME_ALIGN = `SELECT timeDiff FROM lyrics_time_align WHERE bvid = @bvid AND cid = @cid AND songId = @songId`

  const select_stmt = db.prepare(GET_LYRICS_TIME_ALIGN, [bvid, cid, songId])
  return select_stmt.all({ bvid, cid, songId })
  // return row
}

export function queryCollectListSavedMetadataFromDb() {
  const db = getDb()
  const GET_COLLECT_LIST_METADATA = `SELECT * FROM bili_collect`
  const select_stmt = db.prepare(GET_COLLECT_LIST_METADATA)
  return select_stmt.all()
}

export function insertCollectListMetadataToDb(collectList) {
  const db = getDb()
  // 保存设置
  const SQL_INSERT_BILI_COLLECT = `INSERT INTO bili_collect (id, title, cover, bili_collect_id, play_num, up_name, up_mid, media_count, custom_name, sync)
    VALUES (@id, @title, @cover,  @bili_collect_id, @play_num, @up_name, @up_mid, @media_count, @custom_name, false);`

  const insert_stmt = db.prepare(SQL_INSERT_BILI_COLLECT)

  const insertMany = db.transaction((list) => {
    for (const item of list) {
      insert_stmt.run(item)
    }
  })

  let collectListConverted = convertAllValuesToStrings(collectList) // 👈 确保所有字段都是字符串
  insertMany(collectListConverted) // 👈 批量插入
}

/**
 * 将对象数组中的所有字段转换为字符串（用于存入 TEXT 类型的 SQLite 字段）
 * @param {Array<Object>} list - 要转换的对象数组
 * @returns {Array<Object>} - 转换后的对象数组
 */
function convertAllValuesToStrings(list) {
  return list.map((item) => {
    const converted = {}
    for (const key in item) {
      const value = item[key]

      // null/undefined 直接跳过
      if (value === null || value === undefined) {
        converted[key] = null
      }
      // 如果是 bigint 或 number，转为整数字符串（避免 .0）
      else if (typeof value === 'number') {
        // 检查是否是整数，否则用字符串保留小数
        converted[key] = Number.isInteger(value) ? String(value) : value.toString() // 可改为 String(parseInt(value)) 如果你要强制整数
      }
      // 其他（字符串、布尔、对象等）直接转为字符串
      else {
        converted[key] = String(value)
      }
    }
    return converted
  })
}

export const queryCollectVideosListPage = (filter) => {
  // TODO queryCollectVideosListPage page
  // const queryCollectVideosListPage

  let list = []
  let total = 0

  return {
    list,
    total
  }
}

export const getbiliCollect = (id) => {
  const db = getDb()
  const GET_COLLECT_LIST_METADATA = `SELECT * FROM bili_collect where id = @id`
  const select_stmt = db.prepare(GET_COLLECT_LIST_METADATA)
  return select_stmt.get({ id })
}

export const insertBiliVideoToDb = (videos) => {
  const db = getDb()

  const SQL_INSERT_Bili_Video = `INSERT INTO bili_video (id, collect_id, name, bvid, cid, pic_url) VALUES (@id, @collect_id, @name, @bvid, @cid, @pic_url);`
  const insert_stmt = db.prepare(SQL_INSERT_Bili_Video)

  const insertMany = db.transaction((list) => {
    for (const item of list) {
      insert_stmt.run(item)
    }
  })
  console.log(typeof videos)
  let videosListConverted = convertAllValuesToStrings(videos) // 👈 确保所有字段都是字符串
  insertMany(videosListConverted) // 👈 批量插入
}
