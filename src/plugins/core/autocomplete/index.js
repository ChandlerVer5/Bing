import { search } from 'cerebro-tools'
import { flow, filter, map, partialRight, values } from 'lodash/fp'
import getPlugins from '../..'

const toString = (plugin) => plugin.keyword
const notMatch = (term) => (plugin) => plugin.keyword !== term && plugin.keyword !== term

const pluginToResult = (actions) => (res) => ({
  upxFile: res.upxFile, // TODO need+
  // plugin: res.upxFile, // TODO selected Plugin name
  upxId: res.upxId, // flag for utools's plugin,is upx' name
  title: res.name, // upx'json code
  icon: res.icon,
  term: `${res.keyword} `, // upx'json one of cmds
  onSelect: (event) => {
    res.upxId && window.upxRpc.showUpx(res.upxId, res.name)
    event.preventDefault()
    actions.replaceTerm(`${res.keyword} `)
  }
})

/**
 * Plugin for autocomplete other plugins
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({ term, display, actions }) =>
  flow(
    values,
    filter((plugin) => !!plugin.keyword),
    partialRight(search, [term, toString]),
    filter(notMatch(term)),
    map(pluginToResult(actions)),
    display
  )(getPlugins())

export default {
  fn,
  name: 'Plugins autocomplete'
}
