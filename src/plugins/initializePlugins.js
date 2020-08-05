import getPlugins from '.'
import { getPlugSettings } from './config'

// const initPlugLoad = (pluginName) => mainRpc.pluginClient.requirePlugin(pluginName)

const plugins = getPlugins()

export const initPlugSetting = (name) => {
  const { initialize, initializeAsync } = plugins[name]
  if (initialize) {
    // Foreground plugin initialization
    try {
      initialize(getPlugSettings(name))
    } catch (error) {
      console.error(`Failed to initialize plugin: ${name}`, error)
    }
  }

  if (initializeAsync) {
    // Background plugin initialization
    // mainRpc.ipcSend('initializePluginAsync', { name })
    console.log('initializeAsync!!!', name)
  }
}

/**
 * RPC-call for plugins initializations
 */
export default () => {
  // Start listening for replies from plugin async initializers
  /*  mainRpc.ipcOn('plugin.message', ({ name, data }) => {
    const plugin = plugins[name]
    if (plugin.onMessage) plugin.onMessage(data)
  }) */
  // const plugins = mainRpc.pluginClient.pluginConfigs('cerebro')

  Object.keys(plugins).forEach(initPlugSetting)
}
