import initializePlugins from '@/plugins/initializePlugins'
import { updateItem } from './actions/search'

const changeTheme = (src) => {
  document.getElementById('cerebro-theme').href = src
}

export default (store) => {
  // Initialize plugins
  initializePlugins()

  // Set theme from config
  changeTheme(MainRpc.getConfig('theme'))

  // Handle `showTerm` rpc event and replace search term with payload
  MainRpc.ipcOn('showTerm', (term) => store.dispatch(updateItem(term)))

  MainRpc.ipcOn(
    'update-downloaded',
    () =>
      new Notification('Cerebro: update is ready to install', {
        body: 'New version is downloaded and will be automatically installed on quit'
      })
  )

  // Handle `updateTheme` rpc event and change current theme
  // MainRpc.ipcOn("updateTheme", changeTheme);

  // Handle `reload` rpc event and reload window
  MainRpc.ipcOn('reload', () => window.location.reload())
}
