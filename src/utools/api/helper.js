import { BrowserWindow, BrowserView } from 'electron'

export const getMainWindow = () => BrowserWindow.fromId(global.mainWinId)

export const getViewById = (upxName) => global.runningUpxPlugins[upxName]

export const getPluginIdByWebContents = (contents) => {
  const plgs = global.runningUpxPlugins
  Object.keys(plgs).forEach((id) => {
    if (plgs[id].view.webContents === contents) {
      return id
    }
    return null
  })
}

export const getWorkWebContentsBySender = (contents) => {
  const bview = BrowserView.fromWebContents(contents)
  if (!bview) return null
  const bwindow = BrowserWindow.fromBrowserView(bview)
  if (!bwindow) return null
  if (bwindow === getMainWindow()) return getMainWindow().webContents
  const name = this.getPluginIdByWebContents(contents)
  if (!name) return null
  const o = getViewById(name)
  console.log('!!!getWorkWebContentsBySender', name)
  return o && o.detachWindows.includes(bwindow) ? bwindow.webContents : null
}
