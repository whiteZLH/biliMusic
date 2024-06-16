import { BaseWindow } from 'electron'

export const move = (e, x, y, w, h) => {
  const win = getLyricsWindow()
  // win.maximize(）
  // const bounds = win.getBounds()
  const bounds = {
    x: x,
    y: y,
    width: parseInt(w),
    height: parseInt(h)
  }

  win.setBounds(bounds)
}

export const closeWindow = () => {
  const win = getLyricsWindow()
  win.close()
}

const getLyricsWindow = () => {
  for (const Window of BaseWindow.getAllWindows()) {
    if (Window.id !== 1) return Window
  }
}

export const alwaysTop = (targetTop) => {
  const win = getLyricsWindow()
  win.setAlwaysOnTop(targetTop, 'screen-saver')
}

export const IgnoreMouseEvents = () => {
  const win = getLyricsWindow()
  win.setIgnoreMouseEvents(true)
}
