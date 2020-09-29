// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
import { shell, clipboard, remote, ipcRenderer } from 'electron'
// import path from 'path'
import { exec } from 'child_process'
import { send, on, off } from '@/common/rpc'

const services = remote.getGlobal('services')

console.log('preload.js loaded!', services)

window.UpxRpc = Object.freeze({
  parseUpxJson: (pluginName) => services.parseUpxJson(pluginName),
  adaptPlugin: (upxName, pluginName) => services.adaptPlugin(upxName, pluginName),
  showUpx: (upxId, featureIndex) => services.showUpx(upxId, featureIndex),
  closeUpx: (upxId) => services.closeUpx(upxId),
  sendUpxEvent: (name, type, data) => services.sendUpxEvent(name, type, data),
  showUpxMenu: (upxId) => services.showUpxMenu(upxId)
})

window.MainRpc = Object.freeze({
  remoteApp: remote.app,
  // cerebro need!
  child_exec: exec,
  // !!! src\common\services.js
  // !!! src\common\configs\config.js
  // !!! src\cerebro-ui\FileIcon\getFileIcon\windows.js
  // !!! node_modules\cerebro-tools\shell.js
  // !!! src\cerebro-ui\FileIcon\getFileIcon\index.js
  quitApp: () => {
    remote.app.quit()
  },
  IS_MAC: process.platform === 'darwin',
  IS_LINUX: process.platform === 'linux',
  IS_WIN: process.platform === 'win32',
  //  for all Plugins
  // eslint-disable-next-line no-undef
  requireFunc: (id) => __non_webpack_require__(id),
  pluginClient: {
    PLUGIN_PATH: services.PLUGIN_PATH,
    verValid: (version, optionsOrLoose) => services.verValid(version, optionsOrLoose),
    verGt: (version, anotherVersion) => services.verGt(version, anotherVersion),
    pluginConfigs: (type) => services.getInstallLists(type), // 获取相应插件配置JSON
    getPluginsInDev: () => services.getPluginsInDev(), // 获取相应插件配置JSON
    install: (name) => (name ? services.externalPlugins[name] : services.externalPlugins),
    uninstall: (name) => services.removePlugin(name),
    update: (name) => services.updatePlugin(name)
  },
  getConfig: services.getConfig,
  setConfig: services.getConfig,
  getWinPosition: services.getWinPosition,
  trackEvent: services.trackEvent,

  rendererSend(channel, ...args) {
    ipcRenderer.send(channel, ...args)
  },
  ipcSend(message, payload) {
    send(message, payload)
  },
  ipcOn(message, handler) {
    on(message, handler)
  },
  ipcOff(message) {
    off(message)
  },
  shellOpenExternal(url) {
    shell.openExternal(url)
  },
  copyToClipboard(text) {
    clipboard.writeText(text)
  },
  currentWindow: () => remote.getCurrentWindow()
})
