// plugin from utools,LOL \u{1F606}
import zlib from 'zlib'
import fs from 'fs'
import path from 'path'
import { requireFunc, pluginDir } from '@/common/plugins/base'

global.pluginsPool = {}

/**
 * @description 如果不适用该平台则返回 null,并 notification
 */
function isInapplicable(platform) {
  // TODO notification
  return !platform.includes(global.platform.os)
}

/**
 * @description parse and load utools upx plugin
 * @param {*} plugName
 * @returns {json} configsJson
 */
export const parseUpxJson = (plugName) => {
  const upxJson = requireFunc(`${pluginDir}/${plugName}.asar/plugin.json`)
  if (isInapplicable(upxJson.platform)) return null
  const plugins = []
  upxJson.features.forEach((feature) => {
    const tempUpx = { ...upxJson, pluginId: `${upxJson.name}@${feature.code}`, features: [feature] }
    global.pluginsPool[`${upxJson.name}@${feature.code}`] = tempUpx
    plugins.push(tempUpx)
  })
  return plugins
}

export default (dir) => {
  console.log(dir)
}
