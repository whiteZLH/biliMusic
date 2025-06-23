import { ipcMain } from 'electron'
import {
  min,
  req,
  close,
  getVideoInfo,
  clearCache,
  openLyricsWindow,
  getPathAndUrl,
  saveLyricsTimeToDb,
  updateTaskbarLyrics,
  searchPersonCollect,
  saveCollectListMetadata,
  queryCollectListSavedMetadata,
  queryCollectVideosList,
  getCollectListMetadata,
  getCollectVideoListFromBili,
  saveCollectVideos
} from './registerFunc'

export function registerEvents() {
  ipcMain.handle('req', req)
  ipcMain.handle('close', close)
  ipcMain.handle('min', min)
  ipcMain.handle('getVideoInfo', getVideoInfo)
  ipcMain.handle('clearCache', clearCache)
  ipcMain.handle('openLyricsWindow', openLyricsWindow)
  ipcMain.handle('getPathAndUrl', getPathAndUrl)
  ipcMain.handle('saveLyricsTimeToDb', saveLyricsTimeToDb)
  ipcMain.handle('updateTaskbarLyrics', updateTaskbarLyrics)
  ipcMain.handle('searchPersonCollect', searchPersonCollect)
  ipcMain.handle('saveCollectListMetadata', saveCollectListMetadata)
  ipcMain.handle('queryCollectListSavedMetadata', queryCollectListSavedMetadata)
  ipcMain.handle('queryCollectVideosList', queryCollectVideosList)
  ipcMain.handle('getCollectListMetadata', getCollectListMetadata)
  ipcMain.handle('getCollectVideoListFromBili', getCollectVideoListFromBili)
  ipcMain.handle('saveCollectVideos', saveCollectVideos)
}
