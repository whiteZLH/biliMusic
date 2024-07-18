import { ipcMain } from 'electron'
import {
  min,
  req,
  close,
  getVideoInfo,
  clearCache,
  openLyricsWindow,
  getPathAndUrl,
  saveLyricsTimeToDb
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
}
