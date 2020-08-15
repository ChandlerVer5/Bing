export default {
  getWorkWebContentsBySender(e) {
    const t = BrowserView.fromWebContents(e)
    if (!t) return null
    const i = BrowserWindow.fromBrowserView(t)
    if (!i) return null
    if (i === this.mainWindow) return this.mainWindow.webContents
    const s = this.getPluginIdByWebContents(e)
    if (!s) return null
    const o = this.runningPluginPool[s]
    return o && o.detachWindows.includes(i) ? i.webContents : null
  }
}
