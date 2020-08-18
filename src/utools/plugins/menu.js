import path from 'path'
import { Menu } from 'electron'
import { getMainWindow } from '../api/helper'
import { detachPlugin, exitPlugin } from './display'

function initUpxMenu(upxId) {
  // const e = this.getDetachHotKey()
  /* const template = [
      {
        id: 'detach@' + e,
        label: '分离窗口',
        icon: path.join(__dirname, 'res', 'menu', 'windows@2x.png'),
        accelerator: e,
        click: () => {
          process.nextTick(() => {
            this.windowCmp.detachPlugin()
          })
        }
      },
      {
        id: 'openDevTools',
        label: '开发者工具',
        icon: path.join(__dirname, 'res', 'menu', 'code@2x.png'),
        visible: false,
        accelerator: global.platform.isMacOS ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click: () => {
          // this.windowCmp.openPluginDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        label: '当前插件选项',
        icon: path.join(__dirname, 'res', 'menu', 'check@2x.png'),
        submenu: [
          {
            id: 'enterdetach',
            label: '自动分离窗口',
            type: 'checkbox',
            click: (e) => {
              const t = this.windowCmp.mainWindow.getBrowserView()
              if (!t) return
              const i = this.windowCmp.getUpxIdByWebContents(t.webContents)
              i && (e.checked ? this.appCmp.addEnterDetachPlugin(i) : this.appCmp.removeEnterDetachPlugin(i))
            }
          },
          {
            id: 'outkill',
            label: '隐藏插件后完全退出',
            type: 'checkbox',
            click: (e) => {
              const t = this.windowCmp.mainWindow.getBrowserView()
              if (!t) return
              const i = this.windowCmp.getUpxIdByWebContents(t.webContents)
              i && (e.checked ? this.appCmp.addOutKillPlugin(i) : this.appCmp.removeOutKillPlugin(i))
            }
          }
        ]
      },
      {
        id: 'plugininfo',
        label: '当前插件信息',
        icon: path.join(__dirname, 'res', 'menu', 'info@2x.png'),
        submenu: [
          {
            label: '功能关键字',
            click: () => {
              const e = this.windowCmp.getCurrentPluginId()
              e && this.windowCmp.ffffffff.goInstalledPluginInfo(e)
            }
          },
          {
            label: '详情介绍',
            click: () => {
              const e = this.windowCmp.getCurrentPluginId()
              e && this.windowCmp.ffffffff.goInstalledPluginReadme(e)
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        id: 'close',
        label: '隐藏插件',
        icon: path.join(__dirname, 'res', 'menu', 'minus@2x.png'),
        accelerator: 'Esc',
        click: () => {
          this.windowCmp.outPlugin()
        }
      },
      {
        id: 'exit',
        label: '完全退出',
        icon: path.join(__dirname, 'res', 'menu', 'close@2x.png'),
        accelerator: 'Shift+Esc',
        click: () => {
          this.windowCmp.endPlugin()
        }
      }
    ] */
  return Menu.buildFromTemplate([
    {
      id: 'detach@' + 1,
      label: '分离窗口',
      // icon: path.join(__dirname, 'res', 'menu', 'close@2x.png'),
      accelerator: 'Ctrl+D',
      click: (item, bwin, event) => {
        // console.log(item, bwin, event)
        detachPlugin(upxId)
      }
    },
    {
      id: 'exit',
      label: '完全退出',
      // icon: path.join(__dirname, 'res', 'menu', 'close@2x.png'),
      accelerator: 'Shift+Esc',
      click: () => {
        exitPlugin(upxId)
      }
    }
  ])
}

// eslint-disable-next-line import/prefer-default-export
export const showUpxMenu = (upxId) =>
  initUpxMenu(upxId).popup({
    window: getMainWindow(),
    x: 0,
    y: 0
  })
