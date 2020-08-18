import { BrowserView, session, screen, BrowserWindow } from 'electron'
import path from 'path'
import { INPUT_HEIGHT, WINDOW_WIDTH, MAX_WINDOW_HEIGHT, getBorderWidth } from '@/constants/ui'
import { getSettings, getUpxJson } from './base'
import execJS, { triggerUpxEvent } from '../api/execJs'
import { upxApiOn, sendMainSync } from '../api/ipc'
import { getMainWindow, getRunningUpxById } from '../api/helper'

const isDev = process.env.NODE_ENV === 'development'

/**
 * 不允许再设置高度！
 */
function disableResizeHeight(mainWindow, pluginSettingHeight) {
  const borderWidth = getBorderWidth()
  // TODO :需测试多显示
  const { width } = screen.getPrimaryDisplay().workAreaSize

  mainWindow.setMinimumSize(WINDOW_WIDTH + 2 * borderWidth, pluginSettingHeight + 2 * borderWidth)
  mainWindow.setMaximumSize(width + 2 * borderWidth, pluginSettingHeight + INPUT_HEIGHT * 2 + 2 * borderWidth)
}

/**
 * destroy plugin,dont for detachedWins
 */
export const exitPlugin = (name) => {
  closeView(name)
  global.runningUpxPlugins[name].view.destroy()
  global.runningUpxPlugins[name].view = null
}

/**
 * close plugin  view
 */
export const closeView = (name) => {
  sendMainSync('_restoreMain', { name })
  const mainWindow = getMainWindow()
  mainWindow.setResizable(false)
  mainWindow.setMinimumSize(WINDOW_WIDTH, INPUT_HEIGHT)
  mainWindow.removeBrowserView(global.runningUpxPlugins[name].view)
  mainWindow.setSize(mainWindow.getSize()[0], INPUT_HEIGHT)
}

export const displayPluginView = (name, pluginView, detachWin) => {
  upxApiOn()

  const mainWindowBorderWidth = getBorderWidth()
  let { single, height } = getSettings(name)

  // upx is detached ,so mainWindow is detached WINDOW!!!
  const mainWindow = detachWin || getMainWindow()
  const pluginViewWidth = detachWin ? mainWindow.getSize()[0] : mainWindow.getSize()[0] + 40

  if (height) {
    disableResizeHeight(mainWindow, height)
  } else {
    height = MAX_WINDOW_HEIGHT
  }

  // triggerUpxEvent(name, 'PluginEnter', { code, type, payload, optional }) // when upx every time open
  // triggerUpxEvent(name, 'PluginEnter') // when upx every time open

  // pluginView.webContents.focus()
  mainWindow.setResizable(true)
  mainWindow.setMinimumSize(WINDOW_WIDTH, INPUT_HEIGHT)
  mainWindow.setSize(pluginViewWidth, height + INPUT_HEIGHT * 2 + 2)
  mainWindow.addBrowserView(pluginView)

  // 最后设置 bounds
  pluginView.setBounds({
    x: mainWindowBorderWidth,
    y: INPUT_HEIGHT,
    width: pluginViewWidth - mainWindowBorderWidth * 2,
    height: height + INPUT_HEIGHT
  })
  pluginView.setAutoResize({
    width: true,
    height: true
  })
}

/**
 * compile utools's plugin and display it
 * @param {string} upxJson upx's  name
 */
export const compileUpxPlugin = (uxpId) => {
  // 从缓存中取出，还是去编译
  const lastViewContainer = getRunningUpxById(uxpId)
  if (lastViewContainer && lastViewContainer.view) {
    displayPluginView(uxpId, lastViewContainer.view)
    return
  }

  const { name, pluginName, features, preload, main, upxFile } = getUpxJson(uxpId)

  const upxSession = session.fromPartition(`<plugin:${name}>`)
  const preloadPath = isDev ? path.join(__dirname, '../../../app/preload/utools.js') : path.join(__dirname, 'preload', 'utools.js')
  upxSession.setPreloads([preloadPath])

  // 继续准备编译
  let view = new BrowserView({
    webPreferences: {
      textAreasAreResizable: false,
      devTools: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      enableRemoteModule: false,
      webSecurity: false,
      allowRunningInsecureContent: false,
      navigateOnDragDrop: false,
      spellcheck: false,
      session: upxSession,
      preload: preload && path.resolve(upxFile, preload),
      defaultFontSize: 14,
      defaultFontFamily: {
        standard: 'system-ui',
        serif: 'system-ui'
      }
    }
  })

  view.upxId = uxpId
  view.webContents.loadURL(path.resolve(upxFile, main))
  view.webContents.openDevTools()

  view.webContents.once('dom-ready', (e) => {
    global.runningUpxPlugins[name] = {
      view,
      detachedWins: []
    }
    console.log('dom-ready', view.id)
    // onLy Once
    triggerUpxEvent(name, 'PluginReady') // onPluginReady

    view.webContents.insertCSS(
      `
      html:{border-bottom:2px #ccc solid}
      ::-webkit-scrollbar-track-piece{ background-color: #fff;}
      ::-webkit-scrollbar{ width:8px; height:8px; }
      ::-webkit-scrollbar-thumb{ background-color: #e2e2e2; -webkit-border-radius: 4px; border: 2px solid #fff; }
      ::-webkit-scrollbar-thumb:hover{ background-color: #9f9f9f;}
      `
    )
    displayPluginView(uxpId, view)
  })

  view.webContents.once('crashed', (e) => {
    console.log('crashed', e)
  })

  // prevent page's navigation
  view.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })

  view.webContents.once('destroyed', () => {
    console.log('view-destroyed', view.isDestroyed())
    view = null
    const upxContainer = getRunningUpxById(name)
    if (upxContainer) {
      if (upxContainer.view) {
        if (!upxContainer.view.isDestroyed()) return
        upxContainer.view = null
      }
      if (upxContainer.detachedWins.length > 0) return
      delete global.runningUpxPlugins[name]
    }
  })

  view.webContents.on('before-input-event', (event, input) => {
    console.log('before-input-event', event, input)
  })
}

/**
 * @description detach upx window for multiple upx's instance
 * @param {string} upxId   utools plugin json name
 */
export const detachPlugin = (upxId) => {
  const { name, preload, logo, upxFile } = getUpxJson(upxId)
  const mainWin = getMainWindow()
  const [width, height] = mainWin.getSize()
  const [x, y] = mainWin.getPosition()
  const detachPreload = isDev ? path.join(__dirname, '../../../app/preload/detach.js') : path.join(__dirname, 'preload', 'detach.js')

  const options = {
    show: false,
    autoHideMenuBar: true,
    width,
    height,
    x,
    y,
    frame: false,
    // icon: `file://${path.join(upxFile, logo)}`,
    // backgroundColor: this.windowBackgroundColor,
    webPreferences: {
      devTools: false,
      nodeIntegration: isDev,
      navigateOnDragDrop: false,
      spellcheck: false,
      preload: detachPreload
    }
  }

  let detachWin = new BrowserWindow(options)
  detachWin.setMenu(null)

  detachWin.webContents.loadURL(isDev ? 'http://localhost:8080/detach/index.html' : `file://${path.join(__dirname, 'detach', 'index.html')}`)
  detachWin.webContents.openDevTools({ mode: 'detach' })

  let { view, detachedWins } = getRunningUpxById(name)
  detachWin.once('ready-to-show', () => {
    detachWin.show()
    mainWin.hide()
    global.runningUpxPlugins[name].detachedWins.push(detachWin)
    detachWin.webContents.focus()
    execJS(
      detachWin.webContents,
      `window.render(${JSON.stringify({
        icon: `file://${path.join(upxFile, logo)}`,
        label: 'label',
        subInput: {
          placeholder: 'sss',
          value: 'subInput'
        },
        featureCode: 'featureCode',
        isDev,
        isPluginInfo: true,
        isDarkColors: false
      })})`
    )

    closeView(name)
    displayPluginView(name, view, detachWin)
    process.nextTick(() => {
      global.runningUpxPlugins[name].view = null // flag for detached win!
    })
  })

  detachWin.on('close', () => {
    detachedWins.forEach((win, i) => {
      if (win.getBrowserView() === view) {
        view.destroy()
        console.log(detachWin.id)
        detachWin.destroy()
        detachedWins.splice(i, 1)
      }
    })
    view = null
    detachWin = null
    console.log('detachWin closed,after', detachWin)
  })
}
