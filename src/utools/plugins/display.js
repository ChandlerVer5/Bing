import { BrowserView, session, screen } from 'electron'
import path from 'path'
import { INPUT_HEIGHT, WINDOW_WIDTH, MAX_WINDOW_HEIGHT, getBorderWidth } from '@/constants/ui'
import { getSettings } from './base'
import { triggerUpxEvent } from '../api/execJs'
import { upxApiOn } from '../api/ipc'
import { getMainWindow } from '../api/helper'

const isDev = process.env.NODE_ENV === 'development'

/**
 * upx 会存入数据库所以插件 name 第一无二~
 * @description  multiple plugin running for same moment
 * @example this.runningPluginPool[plugin.name] = {
                view: a,
                detachWindows: []
            },
 */
global.runningUpxPlugins = {}

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
 * destroy plugin
 */
const destroyPlugin = (name) => {
  global.runningUpxPlugins[name].view.destroy()
  delete global.runningUpxPlugins[name]
}

/**
 * @description 原窗口分离，在调出主窗口
 */
/* const detachView = (single) => {
  console.log(single)
} */

const displayPluginView = (upxJson, pluginView) => {
  upxApiOn()
  const { name } = upxJson
  const mainWindowBorderWidth = getBorderWidth()
  let { single, height } = getSettings(name)

  // main Window
  const mainWindow = getMainWindow()
  const pluginViewWidth = mainWindow.getSize()[0]

  if (height) {
    disableResizeHeight(mainWindow, height)
  } else {
    height = MAX_WINDOW_HEIGHT
  }

  console.log(upxJson, global.upxPluginsPool)
  // triggerUpxEvent(name, 'PluginEnter'，{code, type, payload, optional}) // when upx every time open

  // pluginView.webContents.focus()
  mainWindow.setResizable(true)
  mainWindow.setSize(pluginViewWidth, height + INPUT_HEIGHT * 2 + 4)
  mainWindow.addBrowserView(pluginView)

  // 最后设置 bounds
  pluginView.setBounds({
    x: mainWindowBorderWidth,
    y: INPUT_HEIGHT + mainWindowBorderWidth,
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
 * @param {upxPath} upxPath upx's plugin asar path
 * @param {upxJson} upxJson upx's plugin json format
 */
export const compileUpxPlugin = (upxPath, upxJson) => {
  const { name, pluginId, pluginName, features, preload, main } = upxJson

  const upxSession = session.fromPartition(`<plugin:${name}>`)

  const preloadPath = isDev ? path.join(__dirname, '../../../app/preload/upx.js') : path.join(__dirname, 'preload', 'upx.js')
  upxSession.setPreloads([preloadPath])

  const options = {
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
    defaultFontSize: 14,
    defaultFontFamily: {
      standard: 'system-ui',
      serif: 'system-ui'
    }
  }

  preload && (options.preload = path.resolve(upxPath, preload))

  const view = new BrowserView({
    webPreferences: options
  })

  view.webContents.openDevTools()

  view.webContents.loadURL(path.resolve(upxPath, main))

  view.webContents.once('dom-ready', (e) => {
    global.runningUpxPlugins[name] = {
      view,
      detachWindows: []
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

    displayPluginView(upxJson, view)
  })

  view.webContents.once('crashed', (e) => {
    console.log('crashed', e)
  })

  /* const win = new BrowserWindow({
  webPreferences:pluginWinOptions
  })
  win.webContents.loadURL(`${pluginDir}/npmLook-0.1.2.asar/index.html`)
  // session.fromPartition(partition)

  const contents = win.webContents

 console.log(
                                           'contents:',
                                           contents.session
                                         )
                                         console.log('getAllWebContents:', webContents.getAllWebContents()) */

  // 在主进程中.
  /*   let win = new BrowserWindow({ width: 800, height: 600 })
  win.webContents.loadURL('https://sogou.com')
  win.on('closed', () => {
    win = null
  })

  let view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
  view.webContents.loadURL('https://baidu.com') */
}

export const enterPlugin = () => {
  // 从缓存中取出，还是去编译
}
