import { BrowserWindow } from 'electron'
import { sendUpxEvent } from './execJs'
import { getMainWindow, getWinOrContentsBySender, getSettings, getUpxSettings } from './helper'

export default {
  buildDetachPluginOptionMenu: (e) => {
    const currentWinView = getWinOrContentsBySender(e.sender, false)
  },
  buildDetachPluginInfoMenu: (e, param) => {},
  sendPluginSomeKeyDownEvent: (e, param) => {},
  sendSubInputChangeEvent: (e, param) => {
    const bcontent = getWinOrContentsBySender(e.sender)

    console.log('sendSubInputChangeEvent', bcontent)
    // const currentContent = BrowserWindow.fromWebContents(e.sender).getBrowserView().webContents
    sendUpxEvent(bcontent, 'input', param)
  }
}
