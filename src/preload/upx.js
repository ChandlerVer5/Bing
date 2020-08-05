'use strict'

const { ipcRenderer } = require('electron')

window.utools = Object.freeze({
  __event__: {},
  // 插件装配初始化完成触发
  onPluginReady: (callback) => {
    if (typeof callback !== 'function') return
    window.utools.__event__.onPluginReady = callback
  },
  // 插件进入时触发
  onPluginEnter: (callback) => {
    if (typeof callback !== 'function') return
    window.utools.__event__.onPluginEnter = callback
  },
  // 插件隐藏时触发
  onPluginOut: (callback) => {
    if (typeof callback !== 'function') return
    window.utools.__event__.onPluginOut = callback
  },
  // 插件分离时触发
  onPluginDetach: (callback) => {
    if (typeof callback !== 'function') return
    window.utools.__event__.onPluginDetach = callback
  },
  // 插件从云端拉取到数据时触发
  onDbPull: (callback) => {
    if (typeof callback !== 'function') return
    window.utools.__event__.onDbPull = callback
  },
  // 隐藏主窗口
  hideMainWindow: (isRestorePreWindow) => {
    if (isRestorePreWindow === false) {
      ipcRenderer.send('api.base', 'hideMainWindow', isRestorePreWindow)
      return true
    }
    return ipcRenderer.sendSync('api.base', 'hideMainWindow', true)
  },

  // 显示主窗口
  showMainWindow: () => {
    return ipcRenderer.sendSync('api.base', 'showMainWindow')
  },

  // 设置插件高度
  setExpendHeight: (height) => {
    return ipcRenderer.sendSync('api.base', 'setExpendHeight', height)
  },
  // 设置子输入框
  setSubInput: (onChange, placeholder = '', isFocus = true) => {
    if (typeof onChange !== 'function') return false
    window.utools.__event__.onSubInputChange = onChange
    return ipcRenderer.sendSync('api.base', 'setSubInput', { placeholder, isFocus })
  },
  // 移除子输入框
  removeSubInput: () => {
    delete window.utools.__event__.onSubInputChange
    return ipcRenderer.sendSync('api.base', 'removeSubInput')
  },
  // 设置子输入框的值
  setSubInputValue: (value) => {
    return ipcRenderer.sendSync('api.base', 'setSubInputValue', value)
  },
  // 子输入框获得焦点
  subInputFocus: () => {
    return ipcRenderer.sendSync('api.base', 'subInputFocus')
  },
  // 子输入框获得焦点并选中
  subInputSelect: () => {
    return ipcRenderer.sendSync('api.base', 'subInputSelect')
  },
  // 子输入框失去焦点
  subInputBlur: () => {
    return ipcRenderer.sendSync('api.base', 'subInputBlur')
  },
  // 创建窗口
  createBrowserWindow: (url, options) => {
    const webContentsId = ipcRenderer.sendSync('api.base', 'createBrowserWindow', { url, options })
    if (typeof webContentsId === 'string') throw new Error(webContentsId)
    return webContentsId
  },
  // 隐藏插件
  outPlugin: () => {
    ipcRenderer.send('api.base', 'outPlugin')
  },
  // 是否深色模式
  isDarkColors: () => {
    return ipcRenderer.sendSync('api.base', 'isDarkColors')
  },
  // 设置插件动态功能
  setFeature: (feature) => {
    return ipcRenderer.sendSync('api.app', 'setFeature', feature)
  },
  // 移除插件动态功能
  removeFeature: (code) => {
    return ipcRenderer.sendSync('api.app', 'removeFeature', code)
  },
  // 获取所有插件动态功能
  getFeatures: () => {
    return ipcRenderer.sendSync('api.app', 'getFeatures')
  },
  // 插件间跳转
  redirect: (label, payload) => {
    const err = ipcRenderer.sendSync('api.app', 'redirect', { label, payload })
    if (err) throw new Error(err)
  },
  // 获取闲置的 ubrowser
  getIdleUBrowsers: () => {
    return ipcRenderer.sendSync('api.app', 'getIdleUBrowsers')
  },
  // 设置 ubrowser 代理
  setUBrowserProxy: (config) => {
    return ipcRenderer.sendSync('api.app', 'setUBrowserProxy', config)
  },
  // 清空 ubrowser session 缓存
  clearUBrowserCache: () => {
    return ipcRenderer.sendSync('api.app', 'clearUBrowserCache')
  },
  // 显示系统通知
  showNotification: (body, clickFeatureCode) => {
    ipcRenderer.send('api.app', 'showNotification', { body, clickFeatureCode })
  },
  // 弹出文件选择框
  showOpenDialog: (options) => {
    return ipcRenderer.sendSync('api.app', 'showOpenDialog', options)
  },
  // 弹出文件保存框
  showSaveDialog: (options) => {
    return ipcRenderer.sendSync('api.app', 'showSaveDialog', options)
  },
  // 弹出消息框
  showMessageBox: (options) => {
    return ipcRenderer.sendSync('api.app', 'showMessageBox', options)
  },
  // 插件页面中查找
  findInPage: (text, options) => {
    ipcRenderer.send('api.app', 'findInPage', { text, options })
  },
  // 停止插件页面中查找
  stopFindInPage: (action) => {
    ipcRenderer.send('api.app', 'stopFindInPage', action)
  },
  // 拖拽文件
  startDrag: (file) => {
    ipcRenderer.send('api.app', 'startDrag', file)
  },
  // 屏幕取色
  screenColorPick: (callback) => {
    if (typeof callback === 'function') {
      window.utools.__event__.screenColorPickCallback = callback
    }
    ipcRenderer.send('api.app', 'screenColorPick')
  },
  // 屏幕截图
  screenCapture: (callback) => {
    if (typeof callback === 'function') {
      window.utools.__event__.screenCaptureCallback = callback
    }
    ipcRenderer.send('api.app', 'screenCapture')
  },
  // 获取本地ID
  getLocalId: () => {
    return ipcRenderer.sendSync('api.app', 'getLocalId')
  },
  // 获取路径 与 app.getPath(name) 一致
  getPath: (name) => {
    return ipcRenderer.sendSync('api.app', 'getPath', name)
  },
  // 获取文件图标
  getFileIcon: (filePath) => {
    return ipcRenderer.sendSync('api.app', 'getFileIcon', filePath)
  },
  // 复制文件到剪贴板
  copyFile: (file) => {
    return ipcRenderer.sendSync('api.app', 'copyFile', file)
  },
  // 复制图片到剪贴板
  copyImage: (img) => {
    return ipcRenderer.sendSync('api.app', 'copyImage', img)
  },
  // 复制文本到剪贴板
  copyText: (text) => {
    return ipcRenderer.sendSync('api.app', 'copyText', text)
  },
  // 获取当前文件管理器路径
  getCurrentFolderPath: () => {
    return ipcRenderer.sendSync('api.app', 'getCurrentFolderPath')
  },
  // 获取当前浏览器URL
  getCurrentBrowserUrl: () => {
    return ipcRenderer.sendSync('api.app', 'getCurrentBrowserUrl')
  },
  // 默认方式打开给定的文件
  shellOpenItem: (fullPath) => {
    ipcRenderer.send('api.app', 'shellOpenPath', fullPath)
  },
  // 默认方式打开给定的文件
  shellOpenPath: (fullPath) => {
    ipcRenderer.send('api.app', 'shellOpenPath', fullPath)
  },
  // 在文件管理器中显示给定的文件
  shellShowItemInFolder: (fullPath) => {
    ipcRenderer.send('api.app', 'shellShowItemInFolder', fullPath)
  },
  // 系统默认的协议打开URL
  shellOpenExternal: (url) => {
    ipcRenderer.send('api.app', 'shellOpenExternal', url)
  },
  // 播放哔哔声
  shellBeep: () => {
    ipcRenderer.send('api.app', 'shellBeep')
  },
  // 模拟键盘按键
  simulateKeyboardTap: (key, ...modifier) => {
    ipcRenderer.send('api.app', 'simulateKeyboardTap', { key, modifier })
  },
  // 模拟鼠标单击
  simulateMouseClick: (x, y) => {
    ipcRenderer.send('api.app', 'simulateMouseClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标右击
  simulateMouseRightClick: (x, y) => {
    ipcRenderer.send('api.app', 'simulateMouseRightClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标双击
  simulateMouseDoubleClick: (x, y) => {
    ipcRenderer.send('api.app', 'simulateMouseDoubleClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标移动
  simulateMouseMove: (x, y) => {
    ipcRenderer.send('api.app', 'simulateMouseMove', { x, y })
  },
  // 获取鼠标绝对位置
  getCursorScreenPoint: () => {
    return ipcRenderer.sendSync('api.app', 'getCursorScreenPoint')
  },
  // 获取主显示器
  getPrimaryDisplay: () => {
    return ipcRenderer.sendSync('api.app', 'getPrimaryDisplay')
  },
  // 获取所有显示器
  getAllDisplays: () => {
    return ipcRenderer.sendSync('api.app', 'getAllDisplays')
  },
  // 获取位置所在的显示器
  getDisplayNearestPoint: (point) => {
    return ipcRenderer.sendSync('api.app', 'getDisplayNearestPoint', point)
  },
  // 获取矩形所在的显示器
  getDisplayMatching: (rect) => {
    return ipcRenderer.sendSync('api.app', 'getDisplayMatching', rect)
  },
  // 是否 MacOs 操作系统
  isMacOs: () => {
    return process.platform === 'darwin'
  },
  // 是否 Windows 操作系统
  isWindows: () => {
    return process.platform === 'win32'
  },
  // 是否 Linux 操作系统
  isLinux: () => {
    return process.platform === 'linux'
  },
  db: Object.freeze({
    // 创建/更新文档
    put: (doc) => {
      return ipcRenderer.sendSync('api.db', 'put', doc)
    },
    // 获取文档
    get: (id) => {
      return ipcRenderer.sendSync('api.db', 'get', id)
    },
    // 删除文档 参数可以是 文档对象或id
    remove: (doc) => {
      return ipcRenderer.sendSync('api.db', 'remove', doc)
    },
    // 批量操作文档(新增、修改、删除)
    bulkDocs: (docs) => {
      return ipcRenderer.sendSync('api.db', 'bulkDocs', docs)
    },
    // 获取所有文档 可根据文档id前缀查找
    allDocs: (key) => {
      return ipcRenderer.sendSync('api.db', 'allDocs', key)
    },
    // 获取附件
    getAttachment: (key, attachmentId) => {
      return ipcRenderer.sendSync('api.db', 'getAttachment', { key, attachmentId })
    }
  }),
  get ubrowser() {
    const ubrowser = require('./ubrowser/client')
    ubrowser._queue = []
    return ubrowser
  }
})
