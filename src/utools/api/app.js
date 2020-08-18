import { app, shell } from 'electron'

export default {
  getPath: (e, t) => {
    try {
      e.returnValue = n.app.getPath(t)
    } catch (t) {
      e.returnValue = null
    }
  },
  getFileIcon: (e, t) => {
    app
      .getFileIcon(t, {
        size: 'normal'
      })
      .then((t) => {
        e.returnValue = t.toDataURL()
      })
      .catch(() => {
        e.returnValue = null
      })
  },
  redirect: (e, t) => {
    e.returnValue = this.redirect(t)
  },
  copyFile: (e, t) => {
    t
      ? (Array.isArray(t) || (t = [t]),
        0 !== (t = t.filter((e) => g.a.existsSync(e))).length ? (oe.a.copyFile.apply(null, t), (e.returnValue = !0)) : (e.returnValue = !1))
      : (e.returnValue = !1)
  },
  copyImage: (e, t) => {
    if (!t) return void (e.returnValue = !1)
    let i
    'string' == typeof t
      ? /^data:image\/([a-z]+);base64,/.test(t)
        ? (i = n.nativeImage.createFromDataURL(t))
        : p.a.basename(t) !== t && g.a.existsSync(t) && (i = n.nativeImage.createFromPath(t))
      : 'object' == typeof t && t instanceof Uint8Array && (i = n.nativeImage.createFromBuffer(Buffer.from(t))),
      i && !i.isEmpty() ? (n.clipboard.writeImage(i), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  copyText: (e, t) => {
    n.clipboard.writeText(String(t)), (e.returnValue = !0)
  },
  getCurrentFolderPath: (e) => {
    e.returnValue = this.getCurrentFolderPath()
  },
  getCurrentBrowserUrl: (e) => {
    e.returnValue = this.getCurrentBrowserUrl()
  },
  showOpenDialog: (e, t) => {
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'open', t)
  },
  showSaveDialog: (e, t) => {
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'save', t)
  },
  showMessageBox: (e, t) => {
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'message', t)
  },
  findInPage: (e, { text, options }) => {
    e.sender.findInPage(text, options)
    e.returnValue = true
  },
  stopFindInPage: (e, t) => {
    e.sender.stopFindInPage(t || 'clearSelection')
    e.returnValue = true
  },
  startDrag: (e, t) => {
    if (!t) return
    const i = {
      icon: p.a.join(__dirname, 'res', 'dragfile.png')
    }
    if ('string' == typeof t) i.file = t
    else {
      if (!Array.isArray(t)) return
      i.files = t
    }
    e.sender.startDrag(i)
  },
  shellOpenExternal: (e, url) => {
    shell.openExternal(url)
    e.returnValue = true
  },
  shellShowItemInFolder: (e, item) => {
    shell.showItemInFolder(item)
    e.returnValue = true
  },
  shellOpenItem: (e, path) => {
    shell.openPath(path)
    e.returnValue = true
  },
  shellOpenPath: (e, path) => {
    shell.openPath(path)
    e.returnValue = true
  },
  shellBeep: (e) => {
    shell.beep()
    e.returnValue = true
  },
  simulateKeyboardTap: (e, { key: t, modifier: i }) => {
    const n = [t.toLowerCase()]
    i &&
      Array.isArray(i) &&
      i.length > 0 &&
      i.forEach((e) => {
        n.push(e.toLowerCase())
      }),
      oe.a.simulateKeyboardTap.apply(null, n),
      (e.returnValue = !0)
  },
  simulateMouseClick: (e, t) => {
    t ? oe.a.simulateMouseClick(t.x, t.y) : oe.a.simulateMouseClick(), (e.returnValue = !0)
  },
  simulateMouseRightClick: (e, t) => {
    t ? oe.a.SimulateMouseRightClick(t.x, t.y) : oe.a.SimulateMouseRightClick(), (e.returnValue = !0)
  },
  simulateMouseDoubleClick: (e, t) => {
    t ? oe.a.simulateMouseDoubleClick(t.x, t.y) : oe.a.simulateMouseDoubleClick(), (e.returnValue = !0)
  },
  simulateMouseMove: (e, t) => {
    t ? (oe.a.simulateMouseMove(t.x, t.y), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  getCursorScreenPoint: (e) => {
    e.returnValue = n.screen.getCursorScreenPoint()
  },
  getPrimaryDisplay: (e) => {
    e.returnValue = n.screen.getPrimaryDisplay()
  },
  getAllDisplays: (e) => {
    e.returnValue = n.screen.getAllDisplays()
  },
  getDisplayNearestPoint: (e, t) => {
    e.returnValue = n.screen.getDisplayNearestPoint(t)
  },
  getDisplayMatching: (e, t) => {
    e.returnValue = n.screen.getDisplayMatching(t)
  }
}
