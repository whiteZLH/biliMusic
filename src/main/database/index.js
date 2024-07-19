let dbCache
const { AsyncDatabase } = require('promised-sqlite3')
export async function getDb() {
  if (!dbCache) {
    dbCache = await AsyncDatabase.open('data.db')
  }
  return dbCache
}

export async function checkDatabase() {
  // 检查当前是否具有数据库 sqllite3
  const db = await getDb()
  // 没有则创建歌词时间对齐数据库
  const SQL_CREATE_LYRICS_TIME_ALIGN_TABLE = `CREATE TABLE IF NOT EXISTS "lyrics_time_align" (
  "bvid" text NOT NULL,
  "cid" text NOT NULL,
  "songId" text NOT NULL,
  "timeDiff" real,
  PRIMARY KEY ("bvid", "cid", "songId")
);`
  //TODO 创建设置配置数据库
  db.run(SQL_CREATE_LYRICS_TIME_ALIGN_TABLE).catch((err) => {
    console.log(err)
  })
  console.log('check database finish.')
}

export async function insertLyricsTimeToDb(bvid, cid, songId, timeDiff) {
  const db = await getDb()
  // 保存设置
  const SQL_INSERT_LYRICS_TIME_ALIGN = `INSERT INTO "lyrics_time_align" VALUES (?, ?, ?, ?);
`
  db.run(SQL_INSERT_LYRICS_TIME_ALIGN, [bvid, cid, songId, timeDiff])
    .then((e) => console.log(e))
    .catch((err) => console.log(err))
}

// 根据bvid, cid, songId 查询timeDiff 使用get
export async function queryLyricsTimeAlign(bvid, cid, songId) {
  const db = await getDb()
  console.log(db)
  const GET_LYRICS_TIME_ALIGN = `SELECT timeDiff FROM lyrics_time_align WHERE bvid = ? AND cid = ? AND songId = ?`

  const row = await db.all(GET_LYRICS_TIME_ALIGN, [bvid, cid, songId])
  return row
}
