import { ipcMain, ipcRenderer } from 'electron'
import baseAPI from './base'
import appAPI from './app'

const UPX_BASE_CHANNEL = 'api.base'
const UPX_APP_CHANNEL = 'api.app'

export const sendMainSync = (funcName, args) => ipcMain.emit(UPX_BASE_CHANNEL, funcName, args)
export const sendBaseSync = (funcName, args) => ipcRenderer.sendSync(UPX_BASE_CHANNEL, funcName, args)
export const sendBase = (funcName, args) => ipcRenderer.send(UPX_BASE_CHANNEL, funcName, args)
export const sendAppSync = (funcName, args) => ipcRenderer.sendSync(UPX_APP_CHANNEL, funcName, args)
export const sendApp = (funcName, args) => ipcRenderer.send(UPX_APP_CHANNEL, funcName, args)

export const upxApiOn = () => {
  ipcMain.on(UPX_BASE_CHANNEL, (event, funcName, args) => {
    if (!args) {
      baseAPI[event](funcName)
      return
    }

    if (funcName in baseAPI) {
      event.returnValue = baseAPI[funcName](event, args)
    } else {
      event.returnValue = null
    }
  })
}

export const upxAppOn = () => {
  ipcMain.on(UPX_APP_CHANNEL, (event, funcName, args) => {
    funcName in appAPI ? appAPI[funcName](event, args) : (event.returnValue = null)
  })
}
