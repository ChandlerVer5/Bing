const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Conf = require('./config')
const baseConfig = require('./webpack.base.config')
const mainConfig = require('./webpack.electron.config')
const preloadConfig = require('./webpack.preload.config')

/**
 * Webpack config for preload target
 * @param {string} env
 */

const rendererConfig = merge(baseConfig, {
  mode: process.env.NODE_ENV,
  entry: {
    // polyfills: ["@babel/polyfill", "event-source-polyfill"],
    // vendor: ['react', 'react-dom', 'prop-types'],
    main: Conf.ENTRY
  },
  output: {
    path: Conf.OUTPUT,
    publicPath: './',
    filename: 'renderer.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        exclude: Conf.MODULES,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      title: 'cerebro',
      filename: 'index.html',
      template: `${Conf.SRC}/index.html`,
      hash: true
    })
  ],
  optimization: {
    minimize: false
  },
  target: 'electron-renderer'
})

/**
 * WEBPACK CONFIGS
 */
module.exports = () => {
  const env = process.env.NODE_ENV
  const mergedConfig = [mainConfig, preloadConfig, rendererConfig].map((config) => merge(baseConfig, config))
  console.log('mergedConfig', env, mergedConfig)
  return mergedConfig
}
