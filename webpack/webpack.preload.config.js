const { merge } = require('webpack-merge')
const Conf = require('./config')
const baseConfig = require('./webpack.base.config')

const env = process.env.NODE_ENV

const prepload = (preloadName) =>
  merge(baseConfig, {
    mode: env,
    entry: {
      [preloadName]: `${Conf.SRC}/preload/${preloadName}.js`
    },
    output: {
      // publicPath: path.resolve(__dirname, 'app'),
      publicPath: '/',
      filename: '[name].js',
      path: `${Conf.OUTPUT}/preload`
    },
    target: 'electron-preload'
  })

module.exports = [prepload('preload'), prepload('upx')]
