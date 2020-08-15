import adaptPlugin from '@/utools/plugins/adapter'
import { compileUpxPlugin } from './display'

import { showUpx, parseUpxJson } from './base'

export const initUpxPlugins = () => {
  const { platform } = parseUpxJson()
  if (!platform.includes(global.platform.os)) {
    console.log('当前插件不支持该平台!')
    return
  }
  // 启动插件时   从 config 中读取 相应的配置！比如自动分离
}

export { parseUpxJson, adaptPlugin, compileUpxPlugin, showUpx }
