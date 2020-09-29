import { BrowserView, session, screen, BrowserWindow, protocol } from 'electron'
import path from 'path'
import { INPUT_HEIGHT, WINDOW_WIDTH, MAX_WINDOW_HEIGHT, BORDER_WIDTH } from '@/constants/ui'
import { getUpxJson, upxFilePath } from './base'
import execJS, { triggerUpxEvent } from '../api/execJs'
import { sendMainSync } from '../api/ipc'
import { getUpxSettings, getMainWindow, getRunningUpxById } from '../api/helper'

const isDev = process.env.NODE_ENV === 'development'

/**
 * 不允许再设置高度！
 */
function disableResizeHeight(mainWindow, pluginSettingHeight) {
  // TODO :需测试多显示
  const { width } = screen.getPrimaryDisplay().workAreaSize

  mainWindow.setMinimumSize(WINDOW_WIDTH + 2 * BORDER_WIDTH, pluginSettingHeight + 2 * BORDER_WIDTH)
  mainWindow.setMaximumSize(width + 2 * BORDER_WIDTH, pluginSettingHeight + INPUT_HEIGHT * 2 + 2 * BORDER_WIDTH)
}

/**
 * destroy plugin,dont for detachedWins
 */
export const exitPlugin = (name) => {
  closePlugin(name)
  global.runningUpxPlugins[name].view.destroy()
  global.runningUpxPlugins[name].view = null
}

/**
 * close plugin  view
 * @param {String} name
 * @param {number} index  maybe undefined! detachIndex,close which detached Window
 */
export const closePlugin = (name, index) => {
  const mainWindow = getMainWindow()
  const { view, detachedWins } = getRunningUpxById(name)
  console.log('closePlugin-path:', name, index)
  triggerUpxEvent(name, 'PluginOut')
  if (index >= 0) {
    // eslint-disable-next-line consistent-return
    detachedWins.forEach((win, i) => {
      if (win.getBrowserView().webContents.detachIndex === index) {
        detachedWins[i].close()
        detachedWins.splice(i, 1)
        return false
      }
    })
  } else {
    sendMainSync('_restoreMain', { name })
    mainWindow.setResizable(false)
    mainWindow.setMinimumSize(WINDOW_WIDTH, INPUT_HEIGHT)
    mainWindow.setSize(mainWindow.getSize()[0] - 50, INPUT_HEIGHT)
    mainWindow.removeBrowserView(view)
  }
  return true
}

export const displayPluginView = (name, pluginView, detachWin) => {
  const { single, height, isFixed } = getUpxSettings(name)

  // upx is detached ,so mainWindow is detached WINDOW!!!
  const mainWindow = detachWin || getMainWindow()
  const uxpWinWidth = detachWin ? mainWindow.getSize()[0] : mainWindow.getSize()[0] + 50
  const viewWidth = detachWin ? uxpWinWidth - BORDER_WIDTH : uxpWinWidth - BORDER_WIDTH * 2
  isFixed && disableResizeHeight(mainWindow, height)

  triggerUpxEvent(name, 'PluginEnter', { code: 'date', type: 'text', payload: 'text', optional: undefined }) // when upx every time open
  // TODO triggerUpxEvent(name, 'DbPull', { name, MAX_WINDOW_HEIGHT })

  // pluginView.webContents.focus()
  mainWindow.setResizable(true)
  mainWindow.setMinimumSize(WINDOW_WIDTH, height + INPUT_HEIGHT * 2)
  console.log('height', height + INPUT_HEIGHT * 2 + 2)
  mainWindow.setSize(uxpWinWidth, height + INPUT_HEIGHT * 2 + 2)
  mainWindow.addBrowserView(pluginView)

  // 最后设置 bounds
  pluginView.setBounds({
    x: detachWin ? 0 : BORDER_WIDTH,
    y: INPUT_HEIGHT,
    width: viewWidth,
    height: height + INPUT_HEIGHT
  })
  pluginView.setAutoResize({
    width: true,
    height: true
  })

  // mainWindow.focus()
}

/**
 * compile utools's plugin and display it
 * @param {string} upxJson upx's  name
 */
export const compileUpxPlugin = (upxId) => {
  // 从缓存中取出，还是去编译
  const upxs = getRunningUpxById(upxId)
  if (upxs && upxs.view) {
    displayPluginView(upxId, upxs.view)
    return
  }

  // !upxs && upxApiRegister() //  bind once for same upxId view!
  const { name, pluginName, features, preload, main } = getUpxJson(upxId)

  const upxSession = session.fromPartition(`<plugin:${name}>`)
  const preloadPath = isDev ? path.join(__dirname, '../../../app/preload/utools.js') : path.join(__dirname, 'preload', 'utools.js')
  upxSession.setPreloads([preloadPath])

  // 继续准备编译
  let view = new BrowserView({
    webPreferences: {
      textAreasAreResizable: false,
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      enableRemoteModule: ['clipboard'].includes(upxId),
      webSecurity: false,
      allowRunningInsecureContent: false,
      navigateOnDragDrop: false,
      spellcheck: false,
      preload,
      session: upxSession,
      defaultFontSize: 14,
      defaultFontFamily: {
        standard: 'system-ui',
        serif: 'system-ui'
      }
    }
  })

  view.webContents.upxId = upxId // for convenient, api/base.js
  view.webContents.loadURL(main)
  view.webContents.openDevTools()

  view.webContents.once('dom-ready', () => {
    if (upxs) {
      upxs.view = view
    } else {
      global.runningUpxPlugins[name] = {
        view,
        detachedWins: []
      }
    }

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
    displayPluginView(upxId, view)
  })

  view.webContents.once('crashed', (e) => {
    console.log('crashed', e)
  })

  // prevent page's navigation
  view.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })

  view.webContents.once('destroyed', () => {
    console.log('!!!view-destroyed!!!', view.isDestroyed())
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
    console.log('before-input-event', input)
  })
}

/**
 * @description detach upx window for multiple upx's instance
 * @param {string} upxId   utools plugin json name
 */
export const detachPlugin = (upxId) => {
  const { name, preload, logo } = getUpxJson(upxId)
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
    // icon:  logo,
    // backgroundColor: this.windowBackgroundColor,
    webPreferences: {
      devTools: true,
      nodeIntegration: isDev,
      webSecurity: false,
      navigateOnDragDrop: false,
      spellcheck: false,
      preload: detachPreload
    }
  }

  global.IS_MAC && (options.titleBarStyle = 'hiddenInset')
  options.maximizable = global.IS_LINUX
  options.icon = logo.replace('file://', '')
  options.title = name

  let detachWin = new BrowserWindow(options)
  detachWin.setMenu(null)

  // TODO: need fix this windows layout ?
  // global.IS_MAC && detachWin.getNativeWindowHandle()

  detachWin.webContents.loadURL(isDev ? 'http://localhost:8080/detach/index.html' : `file:///${path.join(__dirname, 'detach', 'index.html')}`)
  detachWin.webContents.openDevTools({ mode: 'detach' })

  let { view, detachedWins } = getRunningUpxById(upxId)

  triggerUpxEvent(upxId, 'PluginDetach')

  detachWin.once('ready-to-show', () => {
    detachWin.show()
    mainWin.hide()
    detachWin.webContents.focus()
    execJS(
      detachWin.webContents,
      `window.render(${JSON.stringify({
        icon: logo,
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

    closePlugin(name)
    process.nextTick(() => {
      const detachIndex = detachedWins.length
      displayPluginView(name, view, detachWin)
      // detachWin.getBrowserView().webContents === view.webContents  === true
      view.webContents.closePlugin = closePlugin // for convenient, api/base.js
      view.webContents.detachIndex = detachIndex // for convenient, api/base.js
      detachedWins.push(detachWin)
      global.runningUpxPlugins[name].view = null // currentView is null
    })
  })

  detachWin.on('close', () => {
    detachedWins.forEach((win, i) => {
      if (win.getBrowserView() === view) {
        view.destroy()
        win.destroy()
        detachedWins.splice(i, 1)
      }
    })
    view = null
    detachWin = null
    console.log('detachWin closed,after', detachWin)
  })
}

/**
 * @description 创建浏览器窗口
 * TODO: 需要进一步限制，不能打开一些连接，和禁用 js。
 */

export function createBrowserWindow(upxId, url, options) {
  const { upxName, preload } = getUpxJson(upxId)
  const params = url.split('?')
  if (!/\.html$/i.test(params[0])) throw new Error('加载的不是html文件!')
  const htmlpath = upxFilePath(upxName, params[0])
  const winOptions = {
    show: true,
    backgroundColor: '',
    webPreferences: {
      defaultFontSize: '14',
      defaultFontFamily: {
        standard: 'system-ui',
        serif: 'system-ui'
      },
      // session
      partition: `<plugin:${upxId}>`,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload
    },
    ...options
  }

  const bwin = new BrowserWindow(winOptions)
  bwin.removeMenu(null)
  bwin.webContents.upxId = upxId
  bwin.loadURL(`${htmlpath + (params.length > 1 ? `?${params[1]}` : '')}`)

  bwin.webContents.once('crashed', () => {
    bwin.destroy()
  })
  return bwin.webContents.id
}
