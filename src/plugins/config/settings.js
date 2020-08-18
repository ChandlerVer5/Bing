import getPlugins from '..'

const getSettings = (pluginName) => MainRpc.getConfig('plugins')[pluginName] || {}

export default (pluginName) => {
  const plugins = getPlugins()
  const settings = getSettings(pluginName)
  if (plugins[pluginName].settings) {
    // Provide default values if nothing is set by user
    Object.keys(plugins[pluginName].settings).forEach((key) => {
      settings[key] = settings[key] || plugins[pluginName].settings[key].defaultValue
    })
  }
  return settings
}
