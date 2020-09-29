import { app, screen, Notification, BrowserView, dialog } from 'electron'

export default {
  getPath: (e, name) => {
    try {
      e.returnValue = app.getPath(name)
    } catch (error) {
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
  showNotification: (e, { body, clickFeatureCode }) => {
    console.log('showNotification', body, clickFeatureCod)
    new Notification({
      title: 'Cerebro',
      body
    }).show()
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
        ? (i = nativeImage.createFromDataURL(t))
        : p.a.basename(t) !== t && g.a.existsSync(t) && (i = nativeImage.createFromPath(t))
      : 'object' == typeof t && t instanceof Uint8Array && (i = nativeImage.createFromBuffer(Buffer.from(t))),
      i && !i.isEmpty() ? (clipboard.writeImage(i), (e.returnValue = !0)) : (e.returnValue = !1)
  },
  getCurrentFolderPath: (e) => {
    e.returnValue = this.getCurrentFolderPath()
  },
  getCurrentBrowserUrl: (e) => {
    e.returnValue = this.getCurrentBrowserUrl()
  },
  showOpenDialog: (e, t) => {
    let s
    const o = BrowserView.fromWebContents(e)
    if (((s = o ? BrowserWindow.fromBrowserView(o) : BrowserWindow.fromWebContents(e)), !s)) return
    let r
    try {
      switch (t) {
        case 'open':
          r = dialog.showOpenDialogSync(s, i)
          break
        case 'save':
          r = dialog.showSaveDialogSync(s, i)
          break
        case 'message':
          r = dialog.showMessageBoxSync(s, i)
      }
    } catch (e) {}
    return (
      s === this.windowCmp.mainWindow &&
        setTimeout(() => {
          this.windowCmp.mainWindow.isVisible() ||
            (this.windowCmp.mainWindow.getBrowserView() && (this.windowCmp.mainWindow.show(), e.isDestroyed() || e.focus()))
        }, 500),
      r
    )
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'open', t)
  },
  showSaveDialog: (e, t) => {
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'save', t)
  },
  showMessageBox: (e, t) => {
    e.returnValue = this.pluginAPIShowDialog(e.sender, 'message', t)
  },
  findInPage: (e, { text, options }) => {
    console.log('findInPage', text)
    e.sender.findInPage(text, options)
    e.returnValue = true
  },
  stopFindInPage: (e, action) => {
    e.sender.stopFindInPage(action || 'clearSelection')
    e.returnValue = true
  },
  startDrag: (e, file) => {
    if (!file) return
    const i = {
      icon: path.join(__dirname, 'res', 'dragfile.png')
    }
    if ('string' == typeof file) i.file = file
    else {
      if (!Array.isArray(file)) return
      i.files = file
    }
    e.sender.startDrag(i)
  },

  simulateKeyboardTap: (e, { key: t, modifier: i }) => {
    const n = [t.toLowerCase()]
    i &&
      Array.isArray(i) &&
      i.length > 0 &&
      i.forEach((e) => {
        push(e.toLowerCase())
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
    e.returnValue = screen.getCursorScreenPoint()
  },
  getPrimaryDisplay: (e) => {
    e.returnValue = screen.getPrimaryDisplay()
  },
  // 获取所有显示器
  getAllDisplays: (e) => {
    e.returnValue = screen.getAllDisplays()
  },
  /**
   * @param {object} point  eg.{x: 100, y: 100 }
   */
  getDisplayNearestPoint: (e, point) => {
    e.returnValue = screen.getDisplayNearestPoint(point)
  },
  getDisplayMatching: (e, rect) => {
    e.returnValue = screen.getDisplayMatching(rect)
  }
}
