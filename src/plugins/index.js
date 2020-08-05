// exports all of plugins
import core from './core'
import getExternalPlugins from './externalPlugns'

window.pluginsContainer = null

/*

window.cerebroPluginsPool = null
window.utoolsPluginsPool = null
window.utoolsPluginsPool = null

function plugins(type) {
  switch (type) {
    case 'cerebro':
      if (window.cerebroPluginsPool) return window.cerebroPluginsPool
      console.log('cerebroPluginsPool:', getExternalPlugins().cerebro)
      return window.cerebroPluginsPool || (window.cerebroPluginsPool = Object.assign(core, getExternalPlugins().cerebro))
    case 'utools':
      if (window.utoolsPluginsPool) return window.utoolsPluginsPool
      console.log('utoolsPluginsPool:', getExternalPlugins().utools)
      return (window.utoolsPluginsPool = getExternalPlugins().utools)
    default:
      return getExternalPlugins()
  }
} */

export default () => {
  if (window.pluginsContainer) return window.pluginsContainer
  const plugins = getExternalPlugins()
  console.log('getALLExternalPlugins:', plugins)
  return window.pluginsContainer || (window.pluginsContainer = Object.assign(core, plugins))
}
