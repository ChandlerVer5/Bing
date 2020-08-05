import initializePlugins from '@/plugins/initializePlugins'
import { updateItem } from './actions/search'

const changeTheme = (src) => {
  document.getElementById('cerebro-theme').href = src
}

export default (store) => {
  // Initialize plugins
  initializePlugins()

  // Set theme from config
  changeTheme(mainRpc.getConfig('theme'))

  // Handle `showTerm` rpc event and replace search term with payload
  mainRpc.ipcOn('showTerm', (term) => store.dispatch(updateItem(term)))

  mainRpc.ipcOn(
    'update-downloaded',
    () =>
      new Notification('Cerebro: update is ready to install', {
        body: 'New version is downloaded and will be automatically installed on quit'
      })
  )

  // Handle `updateTheme` rpc event and change current theme
  // mainRpc.ipcOn("updateTheme", changeTheme);

  // Handle `reload` rpc event and reload window
  mainRpc.ipcOn('reload', () => window.location.reload())
}
