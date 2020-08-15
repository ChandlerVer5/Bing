/* eslint-disable max-params */
import { Notification } from 'electron'

/**
 * @description // FIXME 这里其实需要每次插件显示在前台，都要执行 onPluginEnter😅
 * @param {string} name upx's name equals to plugin's id
 */
const execJS = (bview, execString) => {
  let promise = Promise.resolve('')
  if (typeof bview === 'string') {
    promise = global.runningUpxPlugins[bview].view.webContents.executeJavaScript(execString)
  } else {
    promise = bview.executeJavaScript(execString)
  }
  return promise
}

export const triggerUpxEvent = (name, eventName, data, func) => {
  const jsStr = `
  if(window.utools && window.utools.__event__ && typeof window.utools.__event__.on${eventName} === 'function' ){
   try {
     window.utools.__event__.on${eventName}(${data ? JSON.stringify(data) : ''})
   } catch(e) {} }`

  let timer = setTimeout(() => {
    //  te()(e.webContents.getOSProcessId()), 强制退出
    // new Notification({
    //   title: 'Cerebro',
    //   body: '插件超过5秒未响应, 插件进程已被强制退出'
    // }).show()
  }, 5e3)

  execJS(name, jsStr).then(() => {
    clearTimeout(timer)
    timer = null
    typeof func === 'function' && func()
  })
}

export function sendUpxEvent(name, type, param) {
  switch (type) {
    case 'input':
      console.log('sendUpxEvent', name, type, param)
      triggerUpxEvent(name, 'SubInputChange', { text: param })
      break
    default:
      break
  }
}

export default execJS
