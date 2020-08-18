import { remote, ipcRenderer } from 'electron'

window.DetachRpc = {
  getPlatform: () => process.platform,
  openDevTool: () => {
    const currentWindow = remote.getCurrentWindow()
    const pluginView = currentWindow.getBrowserView()
    if (pluginView) {
      if (pluginView.webContents.isDevToolsOpened()) {
        pluginView.webContents.closeDevTools()
      } else {
        const mode = currentWindow.getSize()[1] < 600 ? 'detach' : 'bottom'
        pluginView.webContents.openDevTools({ mode })
      }
    }
  },
  setAlwaysOnTop: (isTop) => {
    remote.getCurrentWindow().setAlwaysOnTop(isTop)
  },
  closeWindow: () => {
    remote.getCurrentWindow().close()
  },
  minimizeWindow: () => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.blur()
    currentWindow.minimize()
  },
  maximizeWindow: () => {
    const currentWindow = remote.getCurrentWindow()
    if (process.platform === 'win32') {
      currentWindow.emit('win32-maximize')
    } else {
      currentWindow.maximize()
    }
  },
  unmaximizeWindow: () => {
    const currentWindow = remote.getCurrentWindow()
    if (process.platform === 'win32') {
      currentWindow.emit('win32-unmaximize')
    } else {
      currentWindow.unmaximize()
    }
  },
  webContentsFocus: () => {
    remote.getCurrentWindow().webContents.focus()
  },
  buildDetachPluginOptionMenu: () => {
    ipcRenderer.send('detach.handle', 'buildDetachPluginOptionMenu')
  },
  buildDetachPluginInfoMenu: () => {
    ipcRenderer.send('detach.handle', 'buildDetachPluginInfoMenu')
  },
  sendSubInputChangeEvent: (value) => {
    ipcRenderer.send('detach.handle', 'sendSubInputChangeEvent', value)
  },
  sendPluginSomeKeyDownEvent: (code, modifiers) => {
    ipcRenderer.send('detach.handle', 'sendPluginSomeKeyDownEvent', code, modifiers)
  },
  setWindowMaximizeEvent: (maximizeCallback, unmaximizeCallback) => {
    const currentWindow = remote.getCurrentWindow()
    if (process.platform === 'win32') {
      currentWindow.addListener('win32-maximize', maximizeCallback)
      currentWindow.addListener('win32-unmaximize', unmaximizeCallback)
    } else if (process.platform === 'linux') {
      currentWindow.addListener('maximize', maximizeCallback)
      currentWindow.addListener('unmaximize', unmaximizeCallback)
    }
  }
}
