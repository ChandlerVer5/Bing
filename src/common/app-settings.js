import fs from 'fs'
import { app } from 'electron'
import { memoize } from 'cerebro-tools'
import { trackEvent } from './trackEvent'
import loadThemes from './loadThemes'

// initiate portable mode

// set data directory to ./userdata
process.argv.forEach((arg) => {
  if (arg.toLowerCase() === '-p' || arg.toLowerCase() === '--portable') {
    app.setPath('userData', `${process.cwd()}/userdata`)
  }
})

const CONFIG_FILE = `${app.getPath('userData')}/config.json`

const defaultSettings = memoize(() => {
  const locale = app.getLocale() || 'en-US'
  const [lang, country] = locale.split('-')
  return {
    locale,
    lang,
    country,
    // use first theme from loadThemes by default
    theme: loadThemes()[0].value,
    hotkey: 'Control+Space',
    showInTray: true,
    firstStart: true,
    developerMode: false,
    cleanOnHide: true,
    skipDonateDialog: false,
    lastShownDonateDialog: null,
    plugins: {},
    isMigratedPlugins: false,
    trackingEnabled: true,
    crashreportingEnabled: true,
    openAtLogin: true
  }
})

const readConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE).toString())
  } catch (error) {
    return defaultSettings()
  }
}

/**
 * Get a value from global configuration
 * @param  {String} key
 * @return {Any}
 */
const get = (key) => {
  let config
  if (fs.existsSync(CONFIG_FILE)) {
    config = readConfig()
  } else {
    // Save default config to local storage
    config = defaultSettings()
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
  }
  return config[key]
}

/**
 * Write a value to global config. It immedately rewrites global config
 * and notifies all listeners about changes
 *
 * @param  {String} key
 * @param  {Any} value
 */
const set = (key, value) => {
  const config = {
    // If after app update some keys were added to config
    // we use default values for that keys
    ...defaultSettings(),
    ...readConfig()
  }
  config[key] = value
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
  // Track settings changes
  trackEvent({
    category: 'Settings',
    event: `Change ${key}`,
    label: value
  })

  if (global.MainRpc) {
    console.log('notify main process', key, value)
    // Notify main process about settings changes
    MainRpc.rendererSend('updateSettings', key, value)
  }
}

export default { get, set }
