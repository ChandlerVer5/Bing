import { app } from 'electron'

function initAppSafety() {
  app.on('remote-require', (e, t, i) => {
    e.preventDefault()
  })
  app.on('remote-get-guest-web-contents', (e, t) => {
    e.preventDefault()
  })

  app.on('remote-get-builtin', (e, t, i) => {
    e.preventDefault()
  })

  app.on('web-contents-created', (event, webContents) => {
    webContents.on('will-attach-webview', (event, WebPreferences, params) => {
      console.log('will-attach-webview', WebPreferences, params)
    })
  })
}
