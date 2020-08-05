import { BrowserView, session, webContents, BrowserWindow } from 'electron'
import path from 'path'
import { INPUT_HEIGHT, getBorderWidth } from '@/constants/ui'
import { pluginDir } from '@/common/plugins/base'

const isDev = process.env.NODE_ENV === 'development'

/**
 * upx 会存入数据库所以插件 name 第一无二~
 * @description  multiple plugin running for same moment
 * @example this.runningPluginPool[plugin.name] = {
                view: a,
                detachWindows: []
            },
 */

const runningPluginPool = {}

const displayPluginView = (pluginView, upxJson) => {
  console.log('displayPluginView', pluginView, upxJson)
  const mainWindowBorderWidth = getBorderWidth()

  // main Window
  const mainWindow = BrowserWindow.fromId(global.mainWinId)
  const mainBounds = mainWindow.getBounds()

  pluginView.setAutoResize({
    width: true,
    height: true
  })

  pluginView.setBounds({
    x: mainWindowBorderWidth,
    y: INPUT_HEIGHT,
    width: 650 - mainWindowBorderWidth * 2,
    height: 400
  })

  mainWindow.setBrowserView(pluginView)

  pluginView.webContents.focus()

  console.log('mainBounds', mainBounds)
  mainWindow.setSize(646, 600)
}

/**
 * @param {json} upxJson upx's plugin.json
 */
export const compileUpxPlugin = (upxPath, upxJson) => {
  // const { name, pluginName, features, preload } = configs
  const { name, pluginId, pluginName, features, preload, main } = upxJson

  const pluginSession = session.fromPartition(`<plugin:${name}>`)

  pluginSession.setPreloads([path.resolve(__dirname, '../../preload/upx.js')])

  const options = {
    textAreasAreResizable: false,
    // devTools: e.isDev || e.unsafe,
    devTools: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    enableRemoteModule: false,
    webSecurity: false,
    allowRunningInsecureContent: false,
    navigateOnDragDrop: false,
    spellcheck: false,
    session: pluginSession,
    defaultFontSize: 14,
    defaultFontFamily: {
      standard: 'system-ui',
      serif: 'system-ui'
    }
  }

  preload ? (options.preload = preload) : ''

  const view = new BrowserView({
    webPreferences: options
  })

  view.webContents.openDevTools()

  view.webContents.loadURL(path.resolve(upxPath, main))
  view.webContents.insertCSS(
    `
      ::-webkit-scrollbar-track-piece{ background-color: #fff;}
      ::-webkit-scrollbar{ width:8px; height:8px; }
      ::-webkit-scrollbar-thumb{ background-color: #e2e2e2; -webkit-border-radius: 4px; border: 2px solid #fff; }
      ::-webkit-scrollbar-thumb:hover{ background-color: #9f9f9f;}
      `
  )
  view.webContents.once('dom-ready', (e) => {
    runningPluginPool[name] = {
      view,
      detachWindows: []
    }

    displayPluginView(view, upxJson)
  })

  view.webContents.once('crashed', (e) => {
    console.log('crashed', e)
  })

  /* e.name in this.runningPluginPool
    ? (this.runningPluginPool[e.name].view = a)
    : (this.runningPluginPool[e.name] = {
        view: a,
        detachWindows: []
      }) */

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

export const compilePlugin = () => {}
