/* eslint-disable @typescript-eslint/camelcase */
import debounce from 'lodash/debounce'
import path from 'path'
import fs from 'fs'
// import { initializePlugin } from '../plugins/initializePlugins'
import { getInstallLists, getPluginsInDev } from './base'

// require the package
// import asarRequireAuto from 'asar-require-auto'

/**
 * validatePlugSettings plugin module signature
 *
 * @param  {Object} plugin
 * @return {Boolean}
 */

const isPluginValid = (plugin) =>
  plugin &&
  // Check existing of main plugin function
  typeof plugin.fn === 'function' &&
  plugin.fn.length <= 1 // Check that plugin function accepts 0 or 1 argument

// 下载了，即时加载插件，并可以打印出相应信息
export { getInstallLists, getPluginsInDev }

//  TODO: need plugin view to download plugins

// const pluginsWatcher = chokidar.watch(modulesDirectory, { depth: 0 })

/* pluginsWatcher.on('unlinkDir', (pluginPath) => {
  const { base, dir } = path.parse(pluginPath)
  if (dir !== modulesDirectory) {
    return
  }
  const requirePath = window.require.resolve(pluginPath)
  delete plugins[base]
  delete window.require.cache[requirePath]
  console.log(`[${base}] Plugin removed`)
})

pluginsWatcher.on('addDir', (pluginPath) => {
  const { base, dir } = path.parse(pluginPath)
  if (dir !== modulesDirectory) {
    return
  }
  setTimeout(() => {
    console.group(`Load plugin: ${base}`)
    console.log(`Path: ${pluginPath}...`)
    const plugin = requirePlugin(pluginPath)
    if (!isPluginValid(plugin)) {
      console.log('Plugin is not valid, skipped')
      console.groupEnd()
      return
    }
    if (!settings.validatePlugSettings(plugin)) {
      console.log('Invalid plugins settings')
      console.groupEnd()
      return
    }

    console.log('Loaded.')
    const requirePath = window.require.resolve(pluginPath)
    const watcher = chokidar.watch(pluginPath, { depth: 0 })
    watcher.on(
      'change',
      debounce(() => {
        console.log(`[${base}] Update plugin`)
        delete window.require.cache[requirePath]
        plugins[base] = window.require(pluginPath)
        console.log(`[${base}] Plugin updated`)
      }, 1000)
    )
    plugins[base] = plugin
    if (!global.isBackground) {ini
      console.log('Initialize async plugin', base)
      initializePlugin(base)
    }
    console.groupEnd()
  }, 1000)
}) */

// export default plugins
