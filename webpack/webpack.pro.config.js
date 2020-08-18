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

const rendererConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    // polyfills: ["@babel/polyfill", "event-source-polyfill"],
    // vendor: ['react', 'react-dom', 'prop-types'],
    renderer: Conf.ENTRY,
    detach: `${Conf.SRC}/utools/detach/index.js`
  },
  output: {
    path: Conf.OUTPUT,
    publicPath: './', // detach chunk correct path!
    filename: (chunkData) => (chunkData.chunk.name === 'detach' ? 'detach/[name].bundle.js' : '[name].bundle.js')
    // libraryTarget: 'umd'
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
      hash: true,
      minify: true,
      chunks: ['renderer']
    }),
    new HtmlWebpackPlugin({
      title: 'cerebro',
      filename: 'detach/index.html',
      template: `${Conf.SRC}/utools/detach/index.html`,
      hash: true,
      minify: true,
      templateParameters: (compilation, assets, assetTags, options) => {
        const temp = assetTags.bodyTags[0].attributes.src
        assetTags.bodyTags[0].attributes.src = temp.replace('detach/', '') // 修改 chunks 的脚本注入
        return {}
      },
      chunks: ['detach'] // for none! hardcode in html's script injected
    })
  ],
  optimization: {
    minimize: true
  },
  target: 'electron-renderer'
}

/**
 * WEBPACK CONFIGS
 */
module.exports = () => {
  const env = process.env.NODE_ENV
  const mergedConfig = [mainConfig, rendererConfig].map((config) => merge(baseConfig, config))
  console.log('mergedConfig', env, mergedConfig) // preloadConfig[0],
  return [...mergedConfig, ...preloadConfig]
}
