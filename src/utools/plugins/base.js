// plugin from utools,LOL \u{1F606}
import path from 'path'
import { requireFunc, pluginDir } from '@/common/plugins/base'
import { MAX_WINDOW_HEIGHT } from '@/constants/ui'
import { compileUpxPlugin } from './display'

global.upxPluginsPool = {} // for all upx plugin initialize

/**
 * @description 如果不适用该平台则返回 null,并 notification
 */
function isInapplicable(platform) {
  // TODO notification
  return platform ? !platform.includes(global.platform.os) : false
}

// plugin asar' path
export const upxFilePath = (plugName, resName) => path.resolve(pluginDir, `${plugName}.asar`, resName || '')

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
  global.upxPluginsPool[upxJson.name] = { ...upxJson, fileName: plugName }

  upxJson.features.forEach((feature, i) => {
    const tempUpx = { ...upxJson, pluginId: `${upxJson.name}@${i}`, features: [feature] }
    plugins.push(tempUpx)
  })
  return plugins
}

/**
 * @description open upx
 * which feature be opened?
 */
export const showUpx = (upxId, featureCode) => {
  const upxJson = global.upxPluginsPool[upxId]
  console.log(featureCode)
  // 确认选择后，才能打开
  compileUpxPlugin(upxFilePath(upxJson.fileName), upxJson)
}

// 关闭插件释放资源！
export const closeUpx = (upxId) => {
  const upxJson = global.upxPluginsPool[upxId]
  // view.destroy()
}
