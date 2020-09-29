// import { search } from 'cerebro-tools'
import { upxFilePath } from './base'

/* const onSelect = (event) => {
  console.log('global.upxPluginsPool', global.upxPluginsPool, event)
  event.preventDefault()
} */

/**
 * Plugin to reload Cerebro
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */

// json's name is upx‘s id form db

export default (upxFileName, upx) => {
  const { code, explain } = upx.features[0]
  const keyword = upx.features[0].cmds[0]

  const fn = ({ term, display }) => {
    const match = term.match(new RegExp(keyword))
    console.log(term, upx.features, match)
    if (match) {
      // display({ icon: upx.logo, title: name, subtitle, onSelect })
    }
  }

  return {
    fn,
    keyword,
    upxFile: upxFileName,
    upxId: upx.name,
    featureIndex: upx.featureIndex,
    pluginName: upx.pluginName,
    title: code,
    subtitle: explain,
    icon: upxFilePath(upxFileName, upx.logo),
    name: code
  }
}
