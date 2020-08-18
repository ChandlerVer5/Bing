/* eslint-disable promise/no-nesting */
import { app, ipcMain, crashReporter } from 'electron'
import path from 'path'

import registerService from '@/common/services'

import configs from '@/common/app-settings'
import windowMove from '@/common/windowMove'
import { trackEvent, screenView } from '@/common/trackEvent'
import getWinPosition from '@/common/get-win-position'

import createMainWindow from './create-main-win'
import AppTray from './createWindow/app-tray'
import autoStart from './createWindow/auto-start'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const isDev = () => process.env.NODE_ENV === 'development' || configs.get('developerMode')

/*
  "node-79",
  "electron-80"

  "win32",
  "darwin",
  "linux"
*/
// import initAutoUpdater from './initAutoUpdater'

let trayIconSrc = path.resolve(__dirname, process.env.NODE_ENV === 'development' ? '../assets/tray_icon.png' : 'assets/tray_icon.png')
if (process.platform === 'darwin') {
  trayIconSrc = path.resolve(__dirname, process.env.NODE_ENV === 'development' ? '../assets/tray_iconTemplate@2x.png' : 'assets/tray_iconTemplate@2x.png')
} else if (process.platform === 'win32') {
  trayIconSrc = path.resolve(__dirname, process.env.NODE_ENV === 'development' ? '../assets/tray_icon.ico' : 'assets/tray_icon.ico')
}

let mainWindow
let tray

if (process.env.NODE_ENV !== 'development') {
  // Set up crash reporter before creating windows in production builds
  if (configs.get('crashreportingEnabled')) {
    crashReporter.start({
      productName: 'Cerebro',
      companyName: 'Cerebro',
      submitURL: 'http://crashes.cerebroapp.com/post',
      autoSubmit: true
    })
  }
}

app.whenReady().then(() => {
  // eslint-disable-next-line lines-around-comment
  /*   if (process.env.NODE_ENV === 'development') {
    mainWindow = createMainWindow({
      isDev,
      // Main window html
      src: `http://localhost:3000`
    })
  } */
  mainWindow = createMainWindow({
    isDev,
    configs,
    getWinPosition,
    // Main window html
    src: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : `file://${path.join(__dirname, '/index.html')}`
  })

  ipcMain.emit('APP_READY', { mainWinId: mainWindow.id })
  registerService()

  // ---Track app start event---
  trackEvent({
    category: 'App Start',
    event: configs.get('firstStart') ? 'First' : 'Secondary'
  })
  screenView('Search')

  // make Win removable
  windowMove(mainWindow)

  tray = new AppTray({
    src: trayIconSrc,
    isDev: isDev(),
    mainWindow
  })

  // Show tray icon if it is set in configuration
  if (configs.get('showInTray')) {
    tray.show()
  }

  autoStart.isEnabled().then((enabled) => {
    if (configs.get('openAtLogin') !== enabled) {
      autoStart.set(configs.get('openAtLogin'))
    }
  })

  // initAutoUpdater(mainWindow) 更新程序
  app.dock && app.dock.hide()
})

ipcMain.on('message', (event, payload) => {
  console.log(event, payload)
  mainWindow.webContents.send('message', payload)
})

ipcMain.on('updateSettings', (event, key, value) => {
  mainWindow.settingsChanges.emit(key, value)

  // Show or hide menu bar icon when it is changed in setting
  if (key === 'showInTray') {
    value ? tray.show() : tray.hide()
  }

  // Show or hide "development" section in tray menu
  if (key === 'developerMode') {
    tray.setIsDev(isDev())
  }

  // Enable or disable auto start
  if (key === 'openAtLogin') {
    autoStart.isEnabled().then((enabled) => {
      if (value !== enabled) {
        autoStart.set(value)
      }
    })
  }
})
