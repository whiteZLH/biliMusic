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
      move: (x, y, w, h) => ipcRenderer.invoke('move', x, y, w, h),
      closeWindow: () => ipcRenderer.invoke('closeWindow'),
      alwaysTop: (targetTop) => ipcRenderer.invoke('alwaysTop', targetTop),
      IgnoreMouseEvents: () => ipcRenderer.invoke('IgnoreMouseEvents')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
