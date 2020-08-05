const {
  requireFunc,
  pluginClient: { pluginDir, pluginConfigs }
} = window.mainRpc

const requirePlugin = (plugName) => {
  let pluginModule = null

  try {
    pluginModule = requireFunc(`${pluginDir}/${plugName}.asar`)
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
  Object.keys(pluginConfigs('utools')).forEach((pluginName) => {
    const upxPlugins = mainRpc.utools.parseUpxJson(pluginName)
    // console.log(upxPlugins)
    // 需要适配
    upxPlugins &&
      upxPlugins.forEach((upx) => {
        plugins[upx.pluginId] = mainRpc.utools.adaptPlugin(pluginName, upx)
      })
  })

  return plugins
}
