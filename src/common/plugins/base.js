import path from 'path'
import fs from 'fs'
import { app } from 'electron'

// import npm from './npm'
// import upx from './upx'

const isSymlink = (file) => fs.lstatSync(path.join(pluginDir, file)).isSymbolicLink()

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

const EMPTY_PACKAGE_JSON = JSON.stringify(
  {
    name: 'cerebro-plugins',
    cerebro: {},
    utools: {}
  },
  null,
  2
)

// eslint-disable-next-line @typescript-eslint/camelcase
// eslint-disable-next-line no-undef
export const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

export const pluginDir = path.join(app.getPath('userData'), 'plugins')
export const modulesDirectory = path.join(pluginDir, 'node_modules')
export const packageJsonPath = path.join(pluginDir, 'package.json')

export const ensureFiles = () => {
  ensureDir(pluginDir)
  ensureDir(modulesDirectory)
  ensureFile(packageJsonPath, EMPTY_PACKAGE_JSON)
}

/**
 * @param {string} type get current plugins list
 */
export const getInstallLists = (type) => {
  const plugsJson = requireFunc(packageJsonPath)
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
    fs.readdir(pluginDir, (err, files) => {
      if (err) {
        return reject(err)
      }
      return resolve(files.filter(isSymlink))
    })
  })

// export const client = npm(pluginDir)
// export const client = upx(pluginDir)
export const client = {}
