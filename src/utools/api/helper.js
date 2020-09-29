import { BrowserWindow, BrowserView } from 'electron'
import { MAX_WINDOW_HEIGHT } from '@/constants/ui'

export const getMainWindow = () => BrowserWindow.fromId(global.mainWinId)

export const getRunningUpxById = (upxId) => global.runningUpxPlugins[upxId]

/**
 * @returns {Object}
 */
export const getUpxJsonById = (upxId) => global.upxPluginsPool[upxId]

export const getUpxSettings = (upxId) => {
  const { pluginSetting } = getUpxJsonById(upxId)
  let settings = null
  if (pluginSetting) {
    settings = {
      single: !!pluginSetting.single,
      height: pluginSetting.height >= 0 ? pluginSetting.height : MAX_WINDOW_HEIGHT,
      isFixed: pluginSetting.height >= 0
    }
  } else {
    settings = {
      single: true,
      height: MAX_WINDOW_HEIGHT,
      isFixed: false
    }
  }
  return settings
}

/* export const getUpxIdByWebContents = (contents) => {
  const { upxId } = BrowserView.fromWebContents(contents)
  return upxId
} */

/**
 * todo : if  upx autoDetached?
 * @description get working Window or webContents
 * @param {Electron.WebContents} sender e.sender is WebContents
 * @param {boolean} bool get WebContents or not
 */

export const getWinOrContentsBySender = (contents, getContent = true) => {
  const { upxId, detachIndex } = contents
  const detachWin = BrowserWindow.fromWebContents(contents)

  console.log('getWinOrContentsBySender:', upxId, detachIndex)

  //  分离的窗口的主内容！
  if (!upxId) {
    return getContent ? detachWin.getBrowserView().webContents : detachWin
  }
  // const bview = BrowserView.fromWebContents(contents)
  const { detachedWins } = getRunningUpxById(upxId)
  // const bwindow = BrowserWindow.fromWebContents(contents).getBrowserView().webContents
  // const bwindow = BrowserWindow.fromBrowserView(bview)
  const bwindow = typeof detachIndex === 'undefined' ? getMainWindow() : detachedWins[detachIndex]

  // console.log('getWinOrContentsBySender', detachIndex, bwindow.getBrowserView().webContents)
  return getContent ? bwindow.webContents : bwindow
}
