import { ipcMain } from 'electron'
import { upxAppOn } from '@/utools/api/ipc' // for UPX
// import UpxMenu from './menu'

import { parseUpxJson, adaptPlugin, showUpx, closeUpx, showUpxMenu, sendUpxEvent } from '@/utools' // for UPX
import configs from '@/common/app-settings'
import getWinPosition from '@/common/get-win-position'
import { trackEvent } from '@/common/trackEvent'
import { getInstallLists, getPluginsInDev } from '@/common/plugins'

/**
 * @description get electron core module! no matter main or  renderer
 * @param {string} moduleName 模块名 例如:app
export function getCoreModule(moduleName) {
  return electron[moduleName] || electron.remote[moduleName]
}
*/
function initGlobalService(data = {}) {
  global.services = {}

  global.upxPluginsPool = {} // for all upx plugin initialize * upx 会存入数据库所以插件 name 第一无二~
  global.runningUpxPlugins = {} // multiple plugin running for same moment

  // init global variables
  global.platform = {
    os: process.platform,
    isWinOS: process.platform === 'win32',
    isMacOS: process.platform === 'darwin',
    isLinux: process.platform !== 'darwin' && process.platform !== 'win32'
  }
  if (typeof data === 'object') Object.assign(global, data)
}

/**
 * @description APi from main process for renderer
 */
function initService(service = {}) {
  if (typeof service === 'object') Object.assign(global.services, service)
}

/**
 * @description when App is Ready!
 */
ipcMain.once('APP_READY', ({ mainWinId }) => {
  initGlobalService({ mainWinId })
  console.log('APP_READY', global.mainWinId)
  initService({
    getConfig: configs.get,
    setConfig: configs.set,
    getWinPosition,
    trackEvent,
    getInstallLists,
    getPluginsInDev,
    parseUpxJson,
    adaptPlugin,
    showUpx,
    closeUpx,
    sendUpxEvent,
    showUpxMenu
  })

  // listen to upx's renderer's Send message
  upxAppOn()
})

// initServices

export default initService
