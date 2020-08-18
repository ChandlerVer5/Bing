// plugin from utools,LOL \u{1F606}
import path from 'path'
import { requireFunc, pluginDir } from '@/common/plugins/base'
import { MAX_WINDOW_HEIGHT } from '@/constants/ui'
import { displayPluginView, compileUpxPlugin, closeView } from './display'
import { sendMainSync } from '../api/ipc'

/**
 * @description 如果不适用该平台则返回 null,并 notification
 */
function isInapplicable(platform) {
  // TODO notification
  return platform ? !platform.includes(global.platform.os) : false
}

// plugin asar' path
export const upxFilePath = (plugName, resName) => path.resolve(pluginDir, `${plugName}.asar`, resName || '')
export const getUpxJson = (name) => global.upxPluginsPool[name]

export const getSettings = (id) => {
  const defaultSettings = {
    single: false,
    height: MAX_WINDOW_HEIGHT
  }
  return global.upxPluginsPool[id].pluginSetting || defaultSettings
}

/**
 * @description parse and load utools upx plugin
 * @param {*} plugName
 * @returns {json} configsJson
 */
export const parseUpxJson = (plugName) => {
  const upxJson = requireFunc(`${pluginDir}/${plugName}.asar/plugin.json`)
  // TODO:没有main 字段，就是 list 列表
  if (isInapplicable(upxJson.platform)) return null
  const plugins = []
  global.upxPluginsPool[upxJson.name] = { ...upxJson, upxName: plugName, upxFile: upxFilePath(plugName) }

  upxJson.features.forEach((feature, i) => {
    // with pluginId,one feature one plugin fro cerebro autocomplete
    const tempUpx = { ...upxJson, pluginId: `${upxJson.name}@${i}`, features: [feature] }
    plugins.push(tempUpx)
  })
  return plugins
}

/**
 * @description open upx
 * which feature be opened?
 * @example upxJson : {
  pluginName: 'npm 库查询',
  author: 'ChandlerVer5',
  homepage: 'https://www.kancloud.cn/@chandler',
  description: '方便快捷地查询某个 npm 库的相关用法',
  version: '0.1.2',
  logo: 'logo.png',
  main: 'index.html',
  preload: 'preload.js',
  pluginSetting: { single: false },
  features: [ { code: 'npm_search', explain: '查询某个 npm 库的用法', cmds: [Array] } ],
  name: 'a8385fab',
  upxName: 'npmLook-0.1.2',
  upxFile: 'C:\\Users\\ChandlerVer5\\AppData\\Roaming\\MyBing\\plugins\\npmLook-0.1.2.asar'
}
 */
export const showUpx = (upxId, featureCode) => compileUpxPlugin(upxId)

// 关闭插件释放资源！
export const closeUpx = (upxId) => {
  closeView(upxId)
}
