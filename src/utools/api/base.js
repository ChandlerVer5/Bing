/* eslint-disable no-unused-expressions */
import { INPUT_HEIGHT, BORDER_WIDTH } from '@/constants/ui'
import { getMainWindow, getWinOrContentsBySender, getSettings, getUpxSettings } from './helper'
import execJs from './execJs'
import { createBrowserWindow } from '../plugins/view'

export default {
  // for internal use only
  _restoreMain: ({ upxId }) => {
    const wcontents = getMainWindow().webContents
    execJs(wcontents, `window.upxApi._restoreMain()`)
  },

  // TODO for API
  hideMainWindow: (e, isRestorePreWindow) => {
    getMainWindow().webContents === e.sender ? (this.hideMainWindow(t), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  showMainWindow: (e) => {
    const mainWin = getMainWindow()
    const bv = mainWin.getBrowserView()
    if (bv && bv.webContents === e.sender) {
      mainWin.isVisible() || (mainWin.show(), mainWin.focus())
      e.returnValue = true
    } else {
      e.returnValue = false
    }
  },
  setExpendHeight: (e, height) => {
    const { isFixed } = getUpxSettings(e.sender.upxId)
    if (isFixed) return (e.returnValue = false)
    if (typeof height !== 'number') {
      e.returnValue = false
      return
    }
    const win = getWinOrContentsBySender(e.sender, false)
    if (win.id === global.mainWinId) {
      win.setSize(win.getSize()[0], height + INPUT_HEIGHT + BORDER_WIDTH)
      e.returnValue = true
    } else {
      win.setSize(win.getSize()[0], height + INPUT_HEIGHT)
      e.returnValue = true
    }
  },
  // setSubInput(onChange, placeholder, isFocus)
  setSubInput: (e, { isFocus, placeholder }) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    // console.log('setSubInput', bcontent.id)
    if (bcontent) {
      execJs(
        bcontent,
        `window.upxApi.setSubInput(${JSON.stringify({
          placeholder,
          isFocus
        })})`
      ).then(() => {
        bcontent.focus()
        e.returnValue = true
      })
    } else {
      e.returnValue = false
    }
  },
  // removeSubInput()
  removeSubInput: (e) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    bcontent
      ? execJs(bcontent, 'window.upxApi.removeSubInput()').then(() => {
          console.log('removeSubInput', e)
          e.sender.focus()
          e.returnValue = true
        })
      : (e.returnValue = false)
  },
  setSubInputValue: (e, text) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    if (bcontent) {
      execJs(
        bcontent,
        `window.upxApi.setSubInputValue(${JSON.stringify({
          value: String(text)
        })})`
      ).then(() => {
        bcontent.isFocused() || bcontent.focus()
        e.returnValue = true
      })
    } else {
      e.returnValue = false
    }
  },
  subInputFocus: (e) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    if (bcontent) {
      bcontent.isFocused()
      bcontent.focus()
      execJs(bcontent, 'window.upxApi.subInputFocus()').then(() => {
        e.returnValue = true
      })
    } else e.returnValue = false
  },
  subInputSelect: (e) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    if (bcontent) {
      bcontent.isFocused()
      bcontent.focus()
      execJs(bcontent, 'window.upxApi.subInputSelect()').then(() => {
        e.returnValue = true
      })
    } else e.returnValue = false
  },
  subInputBlur: (e) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    if (bcontent) {
      bcontent.focus()
      execJs(bcontent, 'window.upxApi.subInputBlur()').then(() => {
        e.returnValue = true
      })
    } else e.returnValue = false
  },
  outPlugin: (e) => {
    const bcontent = getWinOrContentsBySender(e.sender)
    e.returnValue = bcontent.closePlugin(bcontent.upxId, bcontent.detachIndex)
  },
  createBrowserWindow: (e, { url, options }) => {
    const { upxId } = e.sender
    try {
      e.returnValue = createBrowserWindow(upxId, url, options)
    } catch (error) {
      e.returnValue = error.message
    }
  },
  isDarkColors: (e) => {
    e.returnValue = true
  }
}
