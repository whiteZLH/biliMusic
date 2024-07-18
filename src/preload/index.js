import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      req: (data) => ipcRenderer.invoke('req', data),
      close: () => ipcRenderer.invoke('close'),
      min: () => ipcRenderer.invoke('min'),
      getVideoInfo: (bvid) => ipcRenderer.invoke('getVideoInfo', bvid),
      clearCache: () => ipcRenderer.invoke('clearCache'),
      openLyricsWindow: () => ipcRenderer.invoke('openLyricsWindow'),
      getPathAndUrl: () => ipcRenderer.invoke('getPathAndUrl'),
      saveLyricsTimeToDb: (bvid, cid, songId, timeDiff) => ipcRenderer.invoke('saveLyricsTimeToDb', bvid, cid, songId, timeDiff)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
