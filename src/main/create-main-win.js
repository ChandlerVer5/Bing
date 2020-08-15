import { BrowserWindow, globalShortcut, app, screen, shell } from 'electron'

import debounce from 'lodash/debounce'
import EventEmitter from 'events'
import path from 'path'

import { INPUT_HEIGHT, WINDOW_WIDTH } from '../constants/ui'

import { toggleWin } from './createWindow/win-util'
import handleUrl from './createWindow/handle-url'
import * as donateDialog from './createWindow/donate-dialog'

export default ({ configs, src, isDev, getWinPosition }) => {
  const [x, y] = getWinPosition({})

  const mainWinOptions = {
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    height: INPUT_HEIGHT,
    maxHeight: INPUT_HEIGHT,
    alwaysOnTop: true,
    x,
    y,
    // empty title
    title: '',
    frame: false,
    resizable: false,
    transparent: false,
    // acceptFirstMouse: true,
    // 移除窗口的阴影和动画，否则看起来卡顿一样~
    thickFrame: false,
    // Show main window on launch only when application started for the first time
    // show: configs.get('firstStart'),
    show: true,
    webPreferences: {
      spellcheck: false,
      // session: this.getMainWindwoSession(),
      enableRemoteModule: true,
      nodeIntegration: process.env.NODE_ENV === 'development',
      webSecurity: false,
      // webSecurity: process.env.NODE_ENV !== 'development',
      // allowRunningInsecureContent: process.env.NODE_ENV === 'development',
      backgroundThrottling: false,
      navigateOnDragDrop: false,
      preload: process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../app/preload/preload.js') : path.join(__dirname, 'preload', 'preload.js')
    }
  }

  if (process.platform === 'linux') {
    mainWinOptions.type = 'splash'
  }

  const mainWindow = new BrowserWindow(mainWinOptions)

  // Float main window above full-screen apps
  mainWindow.setAlwaysOnTop(true, 'modal-panel')

  mainWindow.loadURL(src)
  mainWindow.settingsChanges = new EventEmitter()

  // 打开控制台调试工具
  // if (isDev())
  mainWindow.webContents.openDevTools({
    mode: 'detach'
  })

  // Get global shortcut from app settings
  let shortcut = configs.get('hotkey')

  // Function to toggle main window
  const toggleMainWindow = () => toggleWin(mainWindow)

  // Setup event listeners for main window
  globalShortcut.register(shortcut, toggleMainWindow)

  /*  mainWindow.on('blur', () => {
    if (!isDev()) {
      // Hide window on blur in production
      // In development we usually use developer tools that can blur a window
      mainWindow.hide()
    }
  }) */

  // Save window position when it is being moved
  mainWindow.on(
    'move',
    debounce(() => {
      if (!mainWindow.isVisible()) {
        return
      }
      const display = screen.getPrimaryDisplay()
      const positions = configs.get('positions') || {}
      positions[display.id] = mainWindow.getPosition()
      configs.set('positions', positions)
    }, 100)
  )

  mainWindow.on('close', app.quit)

  mainWindow.webContents.on('new-window', (event, url) => {
    shell.openExternal(url)
    event.preventDefault()
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      shell.openExternal(url)
      event.preventDefault()
    }
  })

  // Change global hotkey if it is changed in app settings
  mainWindow.settingsChanges.on('hotkey', (value) => {
    globalShortcut.unregister(shortcut)
    shortcut = value
    globalShortcut.register(shortcut, toggleMainWindow)
  })

  // Change theme css file
  mainWindow.settingsChanges.on('theme', (value) => {
    mainWindow.webContents.send('message', {
      message: 'updateTheme',
      payload: value
    })
  })

  // Handle window.hide: if cleanOnHide value in preferences is true
  // we clear all results and show empty window every time
  const resetResults = () => {
    /*  mainWindow.webContents.send('message', {
      message: 'showTerm',
      payload: ''
    }) */
  }

  // Handle change of cleanOnHide value in settins
  const handleCleanOnHideChange = (value) => {
    if (value) {
      mainWindow.on('hide', resetResults)
    } else {
      mainWindow.removeListener('hide', resetResults)
    }
  }

  // Set or remove handler when settings changed
  mainWindow.settingsChanges.on('cleanOnHide', handleCleanOnHideChange)

  // Set initial handler if it is needed
  handleCleanOnHideChange(configs.get('cleanOnHide'))

  // Restore focus in previous application
  // MacOS only: https://github.com/electron/electron/blob/master/docs/api/app.md#apphide-macos
  if (process.platform === 'darwin') {
    mainWindow.on('hide', () => {
      app.hide()
    })
  }

  // Show main window when user opens application, but it is already opened
  app.on('open-file', (event, path) => handleUrl(mainWindow, path))
  app.on('open-url', (event, path) => handleUrl(mainWindow, path))
  app.on('activate', toggleMainWindow)

  // Someone tried to run a second instance, we should focus our window.
  const shouldQuit = app.requestSingleInstanceLock()
  shouldQuit
    ? app.on('second-instance', () => {
        if (mainWindow) {
          toggleWin(mainWindow)
        }
      })
    : app.quit()

  if (donateDialog.shouldShow()) {
    setTimeout(donateDialog.show, 1000)
  }

  // Save in config information, that application has been started
  configs.set('firstStart', false)

  return mainWindow
}
