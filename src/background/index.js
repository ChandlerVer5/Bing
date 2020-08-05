import plugins from 'plugins'
import { on, send } from 'lib/rpc'
import { getPlugSettings, modulesDirectory } from '@/plugins/config'

require('fix-path')()

// global.React = React
// global.ReactDOM = ReactDOM
global.isBackground = true

on('initializePluginAsync', ({ name }) => {
  console.group(`Initialize async plugin ${name}`)
  try {
    const { initializeAsync } = plugins[name] ? plugins[name] : window.require(`${modulesDirectory}/${name}`)
    if (!initializeAsync) {
      console.log('no `initializeAsync` function, skipped')
      return
    }
    console.log('running `initializeAsync`')
    initializeAsync((data) => {
      console.log('Done! Sending data back to main window')
      // Send message back to main window with initialization result
      send('plugin.message', {
        name,
        data
      })
    }, getPlugSettings(name))
  } catch (err) {
    console.log('Failed', err)
  }
  console.groupEnd()
})

// Handle `reload` rpc event and reload window
on('reload', () => location.reload())
