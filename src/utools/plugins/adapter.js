// import { search } from 'cerebro-tools'
import { pluginDir } from '@/common/plugins/base'
import { compileUpxPlugin } from './display'
import path from 'path'

const onSelect = (event) => {
  console.log('global.pluginsPool', global.pluginsPool, event)

  event.preventDefault()
}

/**
 * Plugin to reload Cerebro
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */

// json's name is upx‘s id form db

export default (upxName, upx) => {
  const { code: name, explain: subtitle } = upx.features[0]
  const upxFilePath = path.resolve(pluginDir, `${upxName}.asar`)
  const keyword = upx.features[0].cmds[0]

  const fn = ({ term, display }) => {
    const match = term.match(new RegExp(keyword))
    if (match) {
      console.log(term, display)
      compileUpxPlugin(upxFilePath, upx)
      // openpluginView
      // display({ icon: upx.logo, title: name, subtitle, onSelect })
    }
  }

  return {
    pluginName: upx.pluginName,
    upx: true,
    keyword,
    title: name,
    subtitle,
    fn,
    icon: path.resolve(upxFilePath, upx.logo),
    name
  }
}
