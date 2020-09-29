// translate main.js

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const baseConfig = require('./webpack.base.config')
// const { ExternalsPlugin } = require('webpack')
const Conf = require('./config')

module.exports = {
  mode: 'production',
  entry: `${Conf.SRC}/main/index.js`,
  output: {
    path: Conf.OUTPUT,
    publicPath: './',
    filename: 'main.js'
  },
  module: {
    noParse: /\.asar$/
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin({
      options: {
        concurrency: 5
      },
      patterns: [
        {
          from: `${Conf.SRC}/assets`,
          to: `${Conf.OUTPUT}/assets`
        }
      ]
    })
  ],
  optimization: {
    minimize: true
  },
  node: {
    __dirname: false,
    __filename: false
  },

  target: 'electron-main'
}
