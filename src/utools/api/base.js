import { getMainWindow, getWorkWebContentsBySender } from './helper'
import execJs from './execJs'

export default {
  hideMainWindow: (e, t) => {
    const i = this.mainWindow.getBrowserView()
    i && i.webContents === e.sender ? (this.hideMainWindow(t), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  showMainWindow: (e) => {
    const mainWin = getMainWindow()
    const bv = mainWin.getBrowserView()
    bv && bv.webContents === e.sender ? (mainWin.isVisible() || this.display.trigger(!0), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  setExpendHeight: (e, t) => {
    // ;(t = 0 | parseInt(t)) < 1 && (t = 1)
    // const i = n.BrowserView.fromWebContents(e.sender)
    // if (!i) return void (e.returnValue = !1)
    // const s = n.BrowserWindow.fromBrowserView(i)
    // if (!s) return void (e.returnValue = !1)
    // if (s === this.mainWindow) return this.setExpendHeight(t), void (e.returnValue = !0)
    // const o = this.getPluginIdByWebContents(e.sender)
    // if (!o) return void (e.returnValue = !1)
    // const r = this.runningPluginPool[o]
    // r && r.detachWindows.includes(s) ? (s.setSize(s.getSize()[0], this.config.initHeight + t), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  setSubInput: (e, { isFocus, placeholder }) => {
    const bview = getWorkWebContentsBySender(e.sender)
    if (bview) {
      execJs(
        bview,
        `window.upxApi.setSubInput(${JSON.stringify({
          placeholder,
          isFocus
        })})`
      ).then(() => {
        e.returnValue = true
      })
    } else {
      e.returnValue = false
    }
  },
  removeSubInput: (e) => {
    const bview = getWorkWebContentsBySender(e.sender)
    bview
      ? execJs(bview, 'window.upxApi.removeSubInput()').then(() => {
          e.sender.focus()
          e.returnValue = true
        })
      : (e.returnValue = false)
  },
  setSubInputValue: (e, text) => {
    const bview = getWorkWebContentsBySender(e.sender)
    if (bview) {
      execJs(
        bview,
        `window.upxApi.setSubInputValue(${JSON.stringify({
          value: String(text)
        })})`
      ).then(() => {
        /* i.isFocused() || i.focus(),
          this.executeJavaScript(i, 'window.api.subInputFocus()').then(() => {
            e.returnValue = true
          }) */
      })
    } else {
      e.returnValue = false
    }
  },
  subInputFocus: (e) => {
    const t = this.getWorkWebContentsBySender(e.sender)
    if (t) {
      if (this.mainWindow.webContents === t && !this.mainWindow.isVisible()) return (this._isMainInputFocus = !0), void (e.returnValue = !0)
      t.isFocused() || t.focus(),
        this.executeJavaScript(t, 'window.upxApi.subInputFocus()').then(() => {
          e.returnValue = !0
        })
    } else e.returnValue = !1
  },
  subInputSelect: (e) => {
    const t = this.getWorkWebContentsBySender(e.sender)
    t
      ? (t.isFocused() || t.focus(),
        this.executeJavaScript(t, 'window.upxApi.subInputSelect()').then(() => {
          e.returnValue = !0
        }))
      : (e.returnValue = !1)
  },
  subInputBlur: (e) => {
    e.sender.focus(), (e.returnValue = !0)
  },
  outPlugin: (e) => {
    const t = n.BrowserView.fromWebContents(e.sender)
    if (!t) return void (e.returnValue = !1)
    const i = n.BrowserWindow.fromBrowserView(t)
    if (!i) return void (e.returnValue = !1)
    if (i === this.mainWindow) return this.outPlugin(), void (e.returnValue = !0)
    const s = this.getPluginIdByWebContents(e.sender)
    if (!s) return void (e.returnValue = !1)
    const o = this.runningPluginPool[s]
    o && o.detachWindows.includes(i) ? (i.close(), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  createBrowserWindow: (e, { url: t, options: i }) => {
    const n = this.getPluginIdByWebContents(e.sender)
    if (n)
      try {
        e.returnValue = this.pluginAPICreateBrowserWindow(n, t, i)
      } catch (t) {
        e.returnValue = t.message
      }
    else e.returnValue = 'called after onPluginReady event'
  },
  isDarkColors: (e) => {
    e.returnValue = this.isDarkColors
  }
}
