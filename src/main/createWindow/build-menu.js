import { Menu, app } from 'electron'
import showWinWithTerm from './show-win-with-term'
import checkForUpdates from './check-updates'
import { donate } from './donate-dialog'
import { toggleWin } from './win-util'

export default ({ mainWindow, isDev }) => {
  const separator = { type: 'separator' }

  const template = [
    {
      label: 'Toggle Cerebro',
      click: () => toggleWin(mainWindow)
    },
    separator,
    {
      label: 'Plugins',
      click: () => showWinWithTerm(mainWindow, 'plugins')
    },
    {
      label: 'Preferences...',
      click: () => showWinWithTerm(mainWindow, 'Cerebro Settings')
    },
    separator,
    {
      label: 'Check for updates',
      click: () => checkForUpdates()
    },
    separator,
    {
      label: 'Donate...',
      click: donate
    }
  ]

  if (isDev) {
    template.push(separator)
    template.push({
      label: 'Development',
      submenu: [
        {
          label: 'DevTools (main)',
          click: () => mainWindow.webContents.openDevTools({ mode: 'detach' })
        },
        {
          label: 'Reload',
          click: () => {
            mainWindow.reload()
          }
        }
      ]
    })
  }

  template.push(separator)
  template.push({
    label: 'Quit Cerebro',
    click: () => app.quit()
  })
  return Menu.buildFromTemplate(template)
}
