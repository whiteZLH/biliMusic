import { ipcMain } from 'electron'
import { min, req, close, getVideoInfo, clearCache, openLyricsWindow, getPathAndUrl } from './registerFunc'

export function registerEvents() {
  ipcMain.handle('req', req)
  ipcMain.handle('close', close)
  ipcMain.handle('min', min)
  ipcMain.handle('getVideoInfo', getVideoInfo)
  ipcMain.handle('clearCache', clearCache)
  ipcMain.handle('openLyricsWindow', openLyricsWindow)
  ipcMain.handle('getPathAndUrl', getPathAndUrl)
}
