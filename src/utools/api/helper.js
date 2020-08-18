import { BrowserWindow, BrowserView } from 'electron'

export const getMainWindow = () => BrowserWindow.fromId(global.mainWinId)

/**
 * @returns {Object}
 */
export const getRunningUpxById = (upxId) => global.runningUpxPlugins[upxId]

export const getUpxIdByWebContents = (contents) => {
  const { upxId } = BrowserView.fromWebContents(contents)
  return upxId
}

/**
 * todo : if  upx autoDetached?
 * @param {Electron.WebContents} WebContents e.sender is WebContents TYPE！
 */
export const getWorkWebContentsBySender = (contents) => {
  const bview = BrowserView.fromWebContents(contents)
  const { view, detachedWins } = getRunningUpxById(bview.upxId)
  const bwindow = BrowserWindow.fromBrowserView(bview)
  if (bwindow === getMainWindow()) return getMainWindow().webContents
  return !view && detachedWins.includes(bwindow) ? bwindow.webContents : null
}
