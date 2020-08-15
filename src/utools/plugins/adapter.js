// import { search } from 'cerebro-tools'
import { upxFilePath } from './base'

const onSelect = (event) => {
  console.log('global.upxPluginsPool', global.upxPluginsPool, event)

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
  const keyword = upx.features[0].cmds[0]

  const fn = ({ term, display }) => {
    const match = term.match(new RegExp(keyword))
    if (match) {
      // TODO: something from user's main Input
      // openpluginView
      // display({ icon: upx.logo, title: name, subtitle, onSelect })
    }
  }

  return {
    upxFile: upxName,
    upxId: upx.name,
    pluginName: upx.pluginName,
    keyword,
    title: name,
    subtitle,
    fn,
    icon: upxFilePath(upxName, upx.logo),
    name
  }
}
