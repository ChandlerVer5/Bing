import { shell, clipboard } from 'electron'
import { send, sendSync, sendApp, sendAppSync, UPX_BASE_CHANNEL, UPX_DB_CHANNEL, UPX_APP_CHANNEL } from '@/utools/api/ipc'

/**
 * this api could be modefied,so freeze it
 */
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
      send('hideMainWindow', isRestorePreWindow)
      return true
    }
    return sendSync(UPX_BASE_CHANNEL, 'hideMainWindow', true)
  },

  // 显示主窗口
  showMainWindow: () => sendSync(UPX_BASE_CHANNEL, 'showMainWindow'),

  // 设置插件高度
  setExpendHeight: (height) => sendSync(UPX_BASE_CHANNEL, 'setExpendHeight', height),
  // 设置子输入框
  setSubInput: (onChange, placeholder = '', isFocus = true) => {
    if (typeof onChange !== 'function') return false
    window.utools.__event__.onSubInputChange = onChange
    return sendSync(UPX_BASE_CHANNEL, 'setSubInput', { placeholder, isFocus })
  },
  // 移除子输入框
  removeSubInput: () => {
    delete window.utools.__event__.onSubInputChange
    return sendSync(UPX_BASE_CHANNEL, 'removeSubInput')
  },
  // 设置子输入框的值
  setSubInputValue: (value) => sendSync(UPX_BASE_CHANNEL, 'setSubInputValue', value),

  // 子输入框获得焦点
  subInputFocus: () => sendSync(UPX_BASE_CHANNEL, 'subInputFocus'),
  // 子输入框获得焦点并选中
  subInputSelect: () => sendSync(UPX_BASE_CHANNEL, 'subInputSelect'),
  // 子输入框失去焦点
  subInputBlur: () => sendSync(UPX_BASE_CHANNEL, 'subInputBlur'),
  // 创建窗口
  createBrowserWindow: (url, options) => {
    const webContentsId = sendSync(UPX_BASE_CHANNEL, 'createBrowserWindow', { url, options })
    if (typeof webContentsId === 'string') throw new Error(webContentsId)
    return webContentsId
  },
  // 隐藏插件
  outPlugin: () => {
    send('outPlugin')
  },
  // 是否深色模式
  isDarkColors: () => sendSync(UPX_BASE_CHANNEL, 'isDarkColors'),

  // 设置插件动态功能
  setFeature: (feature) => {
    return sendAppSync(UPX_APP_CHANNEL, 'setFeature', feature)
  },
  // 移除插件动态功能
  removeFeature: (code) => {
    return sendAppSync(UPX_APP_CHANNEL, 'removeFeature', code)
  },
  // 获取所有插件动态功能
  getFeatures: () => {
    return sendAppSync(UPX_APP_CHANNEL, 'getFeatures')
  },
  // 插件间跳转
  redirect: (label, payload) => {
    const err = sendAppSync(UPX_APP_CHANNEL, 'redirect', { label, payload })
    if (err) throw new Error(err)
  },
  // 获取闲置的 ubrowser
  getIdleUBrowsers: () => sendAppSync(UPX_APP_CHANNEL, 'getIdleUBrowsers'),
  // 设置 ubrowser 代理
  setUBrowserProxy: (config) => sendAppSync(UPX_APP_CHANNEL, 'setUBrowserProxy', config),
  // 清空 ubrowser session 缓存
  clearUBrowserCache: () => sendAppSync(UPX_APP_CHANNEL, 'clearUBrowserCache'),
  // 显示系统通知
  showNotification: (body, clickFeatureCode) => {
    sendApp(UPX_APP_CHANNEL, 'showNotification', { body, clickFeatureCode })
  },
  // 弹出文件选择框
  showOpenDialog: (options) => sendAppSync(UPX_APP_CHANNEL, 'showOpenDialog', options),
  // 弹出文件保存框
  showSaveDialog: (options) => sendAppSync(UPX_APP_CHANNEL, 'showSaveDialog', options),
  // 弹出消息框
  showMessageBox: (options) => sendAppSync(UPX_APP_CHANNEL, 'showMessageBox', options),
  // 插件页面中查找
  findInPage: (text, options) => {
    sendApp(UPX_APP_CHANNEL, 'findInPage', { text, options })
  },
  // 停止插件页面中查找
  stopFindInPage: (action) => {
    sendApp(UPX_APP_CHANNEL, 'stopFindInPage', action)
  },
  // 拖拽文件
  startDrag: (file) => {
    sendApp(UPX_APP_CHANNEL, 'startDrag', file)
  },
  // 屏幕取色
  screenColorPick: (callback) => {
    if (typeof callback === 'function') {
      window.utools.__event__.screenColorPickCallback = callback
    }
    sendApp(UPX_APP_CHANNEL, 'screenColorPick')
  },
  // 屏幕截图
  screenCapture: (callback) => {
    if (typeof callback === 'function') {
      window.utools.__event__.screenCaptureCallback = callback
    }
    sendApp(UPX_APP_CHANNEL, 'screenCapture')
  },
  // 获取本地ID
  getLocalId: () => {
    return sendAppSync(UPX_APP_CHANNEL, 'getLocalId')
  },
  // 获取路径 与 app.getPath(name) 一致
  getPath: (name) => {
    return sendAppSync(UPX_APP_CHANNEL, 'getPath', name)
  },
  // 获取文件图标
  getFileIcon: (filePath) => {
    return sendAppSync(UPX_APP_CHANNEL, 'getFileIcon', filePath)
  },
  // 复制文件到剪贴板
  copyFile: (file) => {
    return sendAppSync(UPX_APP_CHANNEL, 'copyFile', file)
  },
  // 复制图片到剪贴板
  copyImage: (img) => {
    return sendAppSync(UPX_APP_CHANNEL, 'copyImage', img)
  },
  // 复制文本到剪贴板
  copyText: (text) => (clipboard.writeText(String(text)), (e.returnValue = true)),
  // 获取当前文件管理器路径
  getCurrentFolderPath: () => sendAppSync(UPX_APP_CHANNEL, 'getCurrentFolderPath'),
  // 获取当前浏览器URL
  getCurrentBrowserUrl: () => sendAppSync(UPX_APP_CHANNEL, 'getCurrentBrowserUrl'),
  // 默认方式打开给定的文件
  shellOpenPath: (fullPath) => shell.openPath(fullPath),
  // 在文件管理器中显示给定的文件
  shellShowItemInFolder: (fullPath) => shell.showItemInFolder(fullPath),
  // 系统默认的协议打开URL
  shellOpenExternal: (url) => shell.openExternal(url),
  // 播放哔哔声
  shellBeep: () => shell.beep(),
  // 模拟键盘按键
  simulateKeyboardTap: (key, ...modifier) => {
    sendApp(UPX_APP_CHANNEL, 'simulateKeyboardTap', { key, modifier })
  },
  // 模拟鼠标单击
  simulateMouseClick: (x, y) => {
    sendApp(UPX_APP_CHANNEL, 'simulateMouseClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标右击
  simulateMouseRightClick: (x, y) => {
    sendApp(UPX_APP_CHANNEL, 'simulateMouseRightClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标双击
  simulateMouseDoubleClick: (x, y) => {
    sendApp(UPX_APP_CHANNEL, 'simulateMouseDoubleClick', typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined)
  },
  // 模拟鼠标移动
  simulateMouseMove: (x, y) => {
    sendApp(UPX_APP_CHANNEL, 'simulateMouseMove', { x, y })
  },
  // 获取鼠标绝对位置
  getCursorScreenPoint: () => sendAppSync(UPX_APP_CHANNEL, 'getCursorScreenPoint'),
  // 获取主显示器
  getPrimaryDisplay: () => sendAppSync(UPX_APP_CHANNEL, 'getPrimaryDisplay'),
  // 获取所有显示器
  getAllDisplays: () => sendAppSync(UPX_APP_CHANNEL, 'getAllDisplays'),
  // 获取位置所在的显示器
  getDisplayNearestPoint: (point) => sendAppSync(UPX_APP_CHANNEL, 'getDisplayNearestPoint', point),
  // 获取矩形所在的显示器
  getDisplayMatching: (rect) => sendAppSync(UPX_APP_CHANNEL, 'getDisplayMatching', rect),
  // 是否 MacOs 操作系统
  isMacOs: () => process.platform === 'darwin',
  // 是否 Windows 操作系统
  isWindows: () => process.platform === 'win32',
  // 是否 Linux 操作系统
  isLinux: () => process.platform !== 'darwin' && process.platform !== 'win32',

  db: Object.freeze({
    // 创建/更新文档
    put: (doc) => sendSync(UPX_DB_CHANNEL, 'put', doc),
    // 获取文档
    get: (id) => sendSync(UPX_DB_CHANNEL, 'get', id),
    // 删除文档 参数可以是 文档对象或id
    remove: (doc) => sendSync(UPX_DB_CHANNEL, 'remove', doc),
    // 批量操作文档(新增、修改、删除)
    bulkDocs: (docs) => sendSync(UPX_DB_CHANNEL, 'bulkDocs', docs),
    // 获取所有文档 可根据文档id前缀查找
    allDocs: (key) => sendSync(UPX_DB_CHANNEL, 'allDocs', key),
    // 获取附件
    getAttachment: (key, attachmentId) => sendSync(UPX_DB_CHANNEL, 'getAttachment', { key, attachmentId })
  })

  /* TODO get ubrowser() {
    const ubrowser = require('./ubrowser/client')
    ubrowser._queue = []
    return ubrowser
  } */
})
