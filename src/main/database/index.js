import { app } from 'electron'

let dbCache
const Database = require('better-sqlite3')

const filePath = app.getPath('userData') + '/bili.data.db'
export function getDb() {
  if (!dbCache) {
    // dbCache = await AsyncDatabase.open('data.db')
    dbCache = new Database(filePath, { verbose: console.log })
  }
  return dbCache
}

export function checkDatabase() {
  // 检查当前是否具有数据库 sqllite3
  const db = getDb()
  // 没有则创建歌词时间对齐数据库
  const SQL_CREATE_LYRICS_TIME_ALIGN_TABLE = `CREATE TABLE IF NOT EXISTS "lyrics_time_align" (
  "bvid" text NOT NULL,
  "cid" text NOT NULL,
  "songId" text NOT NULL,
  "timeDiff" real,
  PRIMARY KEY ("bvid", "cid", "songId")
);`
  //TODO 创建设置配置数据库
  db.exec(SQL_CREATE_LYRICS_TIME_ALIGN_TABLE)
  console.log('check database finish.')
  return filePath
}

export function insertLyricsTimeToDb(bvid, cid, songId, timeDiff) {
  bvid = bvid + ''
  cid = cid + ''
  songId = songId + ''
  const db = getDb()
  // 保存设置
  const SQL_INSERT_LYRICS_TIME_ALIGN = `INSERT INTO "lyrics_time_align" VALUES (@bvid, @cid, @songId, @timeDiff);
`
  const insert_stmt = db.prepare(SQL_INSERT_LYRICS_TIME_ALIGN)

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
