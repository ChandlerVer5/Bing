import adaptPlugin from '@/utools/plugins/adapter'
import { parseUpxJson, showUpx, closeUpx } from '@/utools/plugins/base'
import { showUpxMenu } from '@/utools/plugins/menu'
import { sendUpxEvent } from '@/utools/api/execJs' // for UPX

export const initUpxPlugins = () => {
  const { platform } = parseUpxJson()
  if (!platform.includes(process.platform)) {
    console.log('当前插件不支持该平台!')
    return
  }
  // 启动插件时   从 config 中读取 相应的配置！比如自动分离
}

// export api for preload.js
export { parseUpxJson, adaptPlugin, showUpx, closeUpx, showUpxMenu, sendUpxEvent }
