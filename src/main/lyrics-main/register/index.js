import { ipcMain } from 'electron'
import { alwaysTop, closeWindow, IgnoreMouseEvents, move } from './registerFunc'

export function registerLyricsEvents() {
  ipcMain.handle('move', move)
  ipcMain.handle('closeWindow', closeWindow)
  ipcMain.handle('alwaysTop', alwaysTop)
  ipcMain.handle('IgnoreMouseEvents', IgnoreMouseEvents)
}
