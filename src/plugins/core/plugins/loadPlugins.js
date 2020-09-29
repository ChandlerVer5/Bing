import { memoize } from 'cerebro-tools'
import availablePlugins from './getAvailablePlugins'
import getInstalledPlugins from './getInstalledPlugins'

const maxAge = 5 * 60 * 1000

const getAvailablePlugins = memoize(availablePlugins, { maxAge })

const parseVersion = (version) => MainRpc.pluginClient.verValid((version || '').replace(/^\^/, '')) || '0.0.0'

export default () =>
  Promise.all([getAvailablePlugins(), getInstalledPlugins(), MainRpc.pluginClient.getPluginsInDev()]).then(([available, installed, debuggingPlugins]) => {
    const listOfAvailablePlugins = available.map((plugin) => {
      const installedVersion = parseVersion(installed[plugin.name])
      const isInstalled = !!installed[plugin.name]
      const isUpdateAvailable = isInstalled && MainRpc.pluginClient.verGt(plugin.version, installedVersion)
      return {
        ...plugin,
        installedVersion,
        isInstalled,
        isUpdateAvailable
      }
    })

    const listOfDebuggingPlugins = debuggingPlugins.map((name) => ({
      name,
      description: '',
      version: 'dev',
      isInstalled: false,
      isUpdateAvailable: false,
      isDebugging: true
    }))
    return [...listOfAvailablePlugins, ...listOfDebuggingPlugins]
  })
