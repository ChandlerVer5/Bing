/* eslint-disable max-params */
import { Notification } from 'electron'
import { getRunningUpxById } from './helper'

/**
 * @description // FIXME 这里其实需要每次插件显示在前台，都要执行 onPluginEnter😅
 * @param {string} WebContent upx'sWebContent or plugin's id
 * @param {string} execString javascript evaluate string
 */
const execJS = (WebContent, execString) => {
  let promise = Promise.resolve('')
  if (typeof WebContent === 'string') {
    const { view, detachedWins } = getRunningUpxById(WebContent) // must have it!
    // console.log('execJS:', execString, detachedWins.length)
    promise = view ? view.webContents.executeJavaScript(execString) : detachedWins[detachedWins.length - 1].webContents.executeJavaScript(execString)
  } else {
    promise = WebContent.executeJavaScript(execString)
  }
  return promise.catch((error) => {
    console.log('~~TriggerUpxEvent_ERROR~~~', error)
  })
}

export const triggerUpxEvent = (upxId, eventName, data) => {
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

  return execJS(upxId, jsStr).then((res) => {
    clearTimeout(timer)
    timer = null
    return res
    // typeof func === 'function' && func()
  })
}

export function sendUpxEvent(upxId, type, param) {
  switch (type) {
    case 'input':
      console.log('sendUpxEvent', upxId, type, param)
      triggerUpxEvent(upxId, 'SubInputChange', { text: param })
      break
    default:
      break
  }
}

export default execJS
