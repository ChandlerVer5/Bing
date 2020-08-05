const { memoize } = require('cerebro-tools')
const empty = () => Promise.reject()

/* eslint-disable global-require */
/* eslint-disable import/no-mutable-exports */

let getFileIcon = empty

if (mainRpc.isMacOS()) {
  getFileIcon = require('./mac')
}

if (mainRpc.isWinOS()) {
  getFileIcon = require('./windows')
}

module.exports = memoize(getFileIcon)

/* eslint-enable global-require */
/* eslint-disable import/no-mutable-exports */
