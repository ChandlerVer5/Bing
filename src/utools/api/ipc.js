/* eslint-disable import/exports-last */
import { ipcMain, ipcRenderer } from 'electron'
import baseAPI from './base'
import appAPI from './app'
import detachAPI from './detach'
import dbAPI from './db'

export const UPX_BASE_CHANNEL = 'upx.base'
export const UPX_DB_CHANNEL = 'upx.db'
export const UPX_APP_CHANNEL = 'upx.app'
export const UPX_DETACH_CHANNEL = 'detach.handle'

const API = {
  [UPX_BASE_CHANNEL]: baseAPI,
  [UPX_DB_CHANNEL]: dbAPI,
  [UPX_APP_CHANNEL]: appAPI,
  [UPX_DETACH_CHANNEL]: detachAPI
}

export const sendMainSync = (funcName, args) => ipcMain.emit(UPX_BASE_CHANNEL, funcName, args)
export const sendSync = (channel, funcName, args) => ipcRenderer.sendSync(channel, funcName, args)
export const send = (channel, funcName, args) => ipcRenderer.send(channel, funcName, args)
export const sendApp = (channel, funcName, args) => ipcRenderer.send(channel, funcName, args)
export const sendAppSync = (channel, funcName, args) => ipcRenderer.send(channel, funcName, args)

// const listener = (channel) => (event, funcName, args) => {}

export const upxApiRegister = () => {
  Object.keys(API).forEach((channel) => {
    ipcMain.on(channel, async (event, funcName, args) => {
      if (!event.sender) {
        API[channel][event](funcName)
        return
      }

      console.log(channel, funcName, event.returnValue)
      if (funcName in API[channel]) {
        // const { upxId } = event.sender
        if (channel === UPX_DB_CHANNEL) {
          event.returnValue = await API[channel][funcName](event, args)
          console.log(channel + funcName, event.returnValue)
        } else {
          event.returnValue = API[channel][funcName](event, args)
        }
      } else {
        event.returnValue = null
      }
    })
  })
}

export const upxApiUnregister = () => {
  Object.keys(API).forEach((channel) => {
    ipcMain.off(channel, listener(channel))
  })
}

export const upxAppOn = () => {
  ipcMain.on(UPX_APP_CHANNEL, (event, funcName, args) => {
    funcName in appAPI ? appAPI[funcName](event, args) : (event.returnValue = null)
  })
}
