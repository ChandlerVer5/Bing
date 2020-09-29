const {
  requireFunc,
  pluginClient: { PLUGIN_PATH, pluginConfigs }
} = window.MainRpc

const requirePlugin = (plugName) => {
  let pluginModule = null

  try {
    pluginModule = requireFunc(`${PLUGIN_PATH}/${plugName}.asar`)
    // Fallback for plugins with structure like `{default: {fn: ...}}`
    const keys = Object.keys(pluginModule)
    if (keys.length === 1 && keys[0] === 'default') {
      pluginModule = pluginModule.default
    }
  } catch (error) {
    // catch all errors from plugin loading
    console.error('Error requiring', error)
  }
  return pluginModule
}

// loadExternalPluginModules
export default () => {
  const plugins = {}

  // get All installed plugins
  Object.keys(pluginConfigs('cerebro')).forEach((pluginName) => {
    plugins[pluginName] = requirePlugin(pluginName)
  })

  // pluginName == pluinName ,id
  Object.keys(pluginConfigs('utools')).forEach((fileName) => {
    const upxPlugins = window.UpxRpc.parseUpxJson(fileName)
    // console.log(upxPlugins)
    // 需要适配
    upxPlugins &&
      upxPlugins.forEach((upx) => {
        // one name has alot of feature
        plugins[upx.pluginId] = window.UpxRpc.adaptPlugin(fileName, upx)
      })
  })

  return plugins
}
