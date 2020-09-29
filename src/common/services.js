import { ipcMain, BrowserWindow } from 'electron'
import { valid, gt } from 'semver'
import { upxApiRegister } from '@/utools/api/ipc' // for UPX
// import UpxMenu from './menu'

import { parseUpxJson, adaptPlugin, showUpx, closeUpx, showUpxMenu, sendUpxEvent } from '@/utools' // for UPX
import { get, set, PLUGIN_PATH } from '@/common/app-configs'
import DBServer from '@/common/db'
import getWinPosition from '@/common/get-win-position'
import { trackEvent } from '@/common/trackEvent'
import { getInstallLists, getPluginsInDev } from '@/common/plugins'
import initAutoUpdater from './autoUpdater'

/**
 * @description get electron core module! no matter main or  renderer
 * @param {string} moduleName 模块名 例如:app
export function getCoreModule(moduleName) {
  return electron[moduleName] || electron.remote[moduleName]
}
*/

function initGlobalService(data = {}) {
  // init global variables

  global.services = {}
  // eslint-disable-next-line @typescript-eslint/camelcase
  // eslint-disable-next-line no-undef
  global.requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require
  global.PLUGIN_PATH = PLUGIN_PATH
  // global.OS = process.platform
  global.IS_WIN = process.platform === 'win32'
  global.IS_MAC = process.platform === 'darwin'
  global.IS_LINUX = process.platform !== 'darwin' && process.platform !== 'win32'

  global.upxPluginsPool = {} // for all upx plugin initialize * upx 会存入数据库所以插件 name 第一无二~
  global.runningUpxPlugins = {} // multiple plugin running for same moment

  if (typeof data === 'object') Object.assign(global, data)
}

/**
 * @description APi from main process for renderer
 */
function initService(service = {}) {
  if (typeof service === 'object') Object.assign(global.services, service)
}

/**
 * @description when App is Ready! register all needed services.
 */
ipcMain.once('APP_READY', async ({ mainWinId }) => {
  initGlobalService({ mainWinId })
  initAutoUpdater(BrowserWindow.fromId(mainWinId))
  upxApiRegister() //  bind once for upx view!
  console.log('APP_READY', global.mainWinId)
  // console.log(await dbGet('demo'))
  initService({
    PLUGIN_PATH,
    DBClient: new DBServer(),
    verValid: valid,
    verGt: gt,
    getConfig: get,
    setConfig: set,
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
  // upxAppOn()
})

// initServices

export default initService
