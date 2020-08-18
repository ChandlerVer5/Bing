const { memoize } = require('cerebro-tools')
const empty = () => Promise.reject()

/* eslint-disable global-require */
/* eslint-disable import/no-mutable-exports */

let getFileIcon = empty

if (MainRpc.isMacOS()) {
  getFileIcon = require('./mac')
}

if (MainRpc.isWinOS()) {
  getFileIcon = require('./windows')
}

module.exports = memoize(getFileIcon)

/* eslint-enable global-require */
/* eslint-disable import/no-mutable-exports */
