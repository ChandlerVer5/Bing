// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
import { shell, clipboard, remote, ipcRenderer } from 'electron'
import path from 'path'
import { exec } from 'child_process'
import { send, on, off } from '../common/rpc'

const services = remote.getGlobal('services')

console.log('preload.js loaded!')

window.upxRpc = {
  parseUpxJson: (pluginName) => services.parseUpxJson(pluginName),
  adaptPlugin: (upxName, pluginName) => services.adaptPlugin(upxName, pluginName),
  showUpx: (upxId) => services.showUpx(upxId),
  sendUpxEvent: (name, type, data) => services.sendUpxEvent(name, type, data)
}

window.mainRpc = {
  remote,
  // cerebro need!
  child_exec: exec,
  // !!! src\common\services.js
  // !!! src\common\configs\config.js
  // !!! src\cerebro-ui\FileIcon\getFileIcon\windows.js
  // !!! node_modules\cerebro-tools\shell.js
  // !!! src\cerebro-ui\FileIcon\getFileIcon\index.js

  //  for all Plugins
  // eslint-disable-next-line no-undef
  requireFunc: (id) => __non_webpack_require__(id),
  pluginClient: {
    pluginDir: path.join(remote.app.getPath('userData'), 'plugins'),
    pluginConfigs: (type) => services.getInstallLists(type), // 获取相应插件配置JSON
    getPluginsInDev: () => services.getPluginsInDev(), // 获取相应插件配置JSON
    install: (name) => (name ? services.externalPlugins[name] : services.externalPlugins),
    uninstall: (name) => services.removePlugin(name),
    update: (name) => services.updatePlugin(name),
    compileUpxPlugin: (name) => services.compileUpxPlugin(name)
  },
  getConfig: services.getConfig,
  setConfig: services.getConfig,
  getWinPosition: services.getWinPosition,
  trackEvent: services.trackEvent,

  quitApp: () => {
    remote.app.quit()
  },
  isMacOS: () => process.platform === 'darwin',
  isWinOS: () => process.platform === 'win32',
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
}
