import path from 'path'
import fs from 'fs'
import { PLUGIN_PATH, PLUGIN_MODULES_PATH, PLUGIN_LIST_FILE, EMPTY_PACKAGE_JSON } from '../app-configs'

// import npm from './npm'
// import upx from './upx'

const isSymlink = (file) => fs.lstatSync(path.join(PLUGIN_PATH, file)).isSymbolicLink()

const ensureFile = (src, content = '') => {
  if (!fs.existsSync(src)) {
    fs.writeFileSync(src, content)
  }
}

const ensureDir = (src) => {
  if (!fs.existsSync(src)) {
    fs.mkdirSync(src)
  }
}

export const ensureFiles = () => {
  ensureDir(PLUGIN_PATH)
  ensureDir(PLUGIN_MODULES_PATH)
  ensureFile(PLUGIN_LIST_FILE, EMPTY_PACKAGE_JSON)
}

/**
 * @param {string} type get current plugins list
 */
export const getInstallLists = (type) => {
  const plugsJson = global.requireFunc(PLUGIN_LIST_FILE)
  delete plugsJson.name
  let result = null
  switch (type) {
    case 'cerebro':
      result = plugsJson[type]
      break
    case 'utools':
      result = plugsJson[type]
      break
    default:
      result = plugsJson
      break
  }
  return result
}

/* Get list of all plugins that are currently in debugging mode.
 * These plugins are symlinked by [create-cerebro-plugin](https://github.com/KELiON/create-cerebro-plugin)
 *
 * @return {Promise<Object>}
 */
export const getPluginsInDev = () =>
  new Promise((resolve, reject) => {
    fs.readdir(PLUGIN_PATH, (err, files) => {
      if (err) {
        return reject(err)
      }
      return resolve(files.filter(isSymlink))
    })
  })

// export const client = npm(PLUGIN_PATH)
// export const client = upx(PLUGIN_PATH)
export const client = {}
