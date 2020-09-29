// plugin from utools,LOL \u{1F606}
import path from 'path'
import { compileUpxPlugin, closePlugin } from './view'
// import { upxApiUnregister } from '../api/ipc'

/**
 * @description 如果不适用该平台则返回 null,并 notification
 */
function isInapplicable(platform) {
  // TODO notification
  return platform ? !platform.includes(process.platform) : false
}

// plugin asar' path
export const upxFilePath = (plugName, ...resName) => `file://${path.resolve(global.PLUGIN_PATH, `${plugName}.asar`, ...resName)}`
export const getUpxJson = (name) => global.upxPluginsPool[name]

/**
 * @description parse and load utools upx plugin！ // TODO:校验文件
 * @param {*} plugName
 * @returns {json} configsJson
 */
export const parseUpxJson = (upxFileName) => {
  const uxpPath = path.join(global.PLUGIN_PATH, `${upxFileName}.asar`)
  const upxJson = global.requireFunc(path.join(uxpPath, 'plugin.json'))
  // TODO:没有main 字段，就是 list 列表
  if (isInapplicable(upxJson.platform)) return null
  const plugins = []
  global.upxPluginsPool[upxJson.name] = {
    ...upxJson,
    logo: upxFilePath(upxFileName, upxJson.logo),
    homepage: upxJson.homepage || 'https://github.com/ChandlerVer5/Bing',
    platform: upxJson.platform || ['win32', 'darwin', 'linux'],
    preload: upxJson.preload ? path.join(uxpPath, upxJson.preload) : '',
    main: upxJson.main ? upxFilePath(upxFileName, upxJson.main) : '',
    upxName: upxFileName
  }

  upxJson.features.forEach((feature, i) => {
    // with pluginId,one feature one plugin fro cerebro autocomplete
    const tempUpx = { ...upxJson, pluginId: `${upxJson.name}@${i}`, featureIndex: i, features: [feature] }
    plugins.push(tempUpx)
  })
  return plugins
}

/**
 * @description open upx
 * which feature be opened?
 * @example :
global.upxPluginsPool[upxJson.name] : {
  pluginName: 'npm 库查询',
  author: 'ChandlerVer5',
  homepage: 'https://www.kancloud.cn/@chandler',
  description: '方便快捷地查询某个 npm 库的相关用法',
  version: '0.1.2',
  logo: 'file://C:\Users\ChandlerVer5\AppData\Roaming\MyBing\plugins\npmLook-0.1.2.asar\logo.png',
  main: 'file://C:\Users\ChandlerVer5\AppData\Roaming\MyBing\plugins\npmLook-0.1.2.asar\index.html',
  preload: 'C:\Users\ChandlerVer5\AppData\Roaming\MyBing\plugins\npmLook-0.1.2.asar\preload.js',
  pluginSetting: { single: false },
  features: [ { code: 'npm_search', explain: '查询某个 npm 库的用法', cmds: [Array] } ],
  name: 'a8385fab',
  upxName: 'npmLook-0.1.2',
}
 */
export const showUpx = (upxId, featureIndex, featureCode) => {
  // upxApiUnregister()
  console.log('showUpx', featureIndex, featureCode)

  compileUpxPlugin(upxId)
}

// 关闭插件释放资源！
export const closeUpx = (upxId) => {
  closePlugin(upxId)
}
