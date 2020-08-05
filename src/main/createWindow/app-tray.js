import { Tray } from 'electron'
import { toggleWin } from './win-util'
import buildMenu from './build-menu'

/**
 * Class that controls state of icon in menu bar
 */
export default class AppTray {
  /**
   * @param  {String} options.src Absolute path for tray icon
   * @param  {Function} options.isDev Development mode or not
   * @param  {BrowserWindow} options.mainWindow
   * @return {AppTray}
   */

  constructor(options) {
    this.tray = null
    this.options = options
  }

  /**
   * Show application icon in menu bar
   */
  show() {
    const tray = new Tray(this.options.src)
    tray.setToolTip('Cerebro')
    tray.setContextMenu(buildMenu(this.options))
    tray.on('click', () => toggleWin(this.options.mainWindow))
    this.tray = tray
  }

  setIsDev(isDev) {
    this.options.isDev = isDev
    if (this.tray) {
      this.tray.setContextMenu(buildMenu(this.options))
    }
  }

  /**
   * Hide icon in menu bar
   */
  hide() {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}
