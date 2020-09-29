const { merge } = require('webpack-merge')
const Conf = require('./config')
const baseConfig = require('./webpack.base.config')

const env = process.env.NODE_ENV

const prepload = (name) =>
  merge(baseConfig, {
    mode: env,
    entry: {
      [name]: name === 'preload' ? `${Conf.SRC}/${name}.js` : `${Conf.SRC}/utools/preload/${name}.js`
    },
    output: {
      // publicPath: path.resolve(__dirname, 'app'),
      publicPath: '/',
      filename: '[name].js',
      path: `${Conf.OUTPUT}/preload`
    },
    target: 'electron-preload'
  })

module.exports = [prepload('preload'), prepload('utools'), prepload('detach')]
