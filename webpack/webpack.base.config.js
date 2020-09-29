// const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const Conf = require('./config')
const babelJSON = require('../.babelrc')

// all dependecies from app/package.json will be included in build/node_modules
const externals = Object.assign(require('../src/package.json').dependencies, require('../src/package.json').optionalDependencies)

module.exports = {
  mode: process.env.NODE_ENV,
  context: Conf.ROOT,
  resolve: {
    modules: [Conf.SRC, Conf.MODULES],
    alias: {
      '@': Conf.SRC
    },
    // 需要处理的文件类型
    extensions: ['.js', '.jsx', '.json', '.mjs']
  },

  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.ExternalsPlugin('commonjs2', ['pouchdb'])
  ],
  node: {
    __dirname: false,
    __filename: false
  },

  // externals: [nodeExternals()],
  // externals: Object.keys(externals || {}),
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   use: 'eslint-loader',
      //   enforce: 'pre',
      //   exclude: Conf.MODULES
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: (modulePath) => modulePath.match(/node_modules/) && !modulePath.match(/node_modules(\/|\\)cerebro-ui/),
        use: {
          loader: 'babel-loader',
          options: babelJSON
        }
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$/,
        exclude: Conf.MODULES,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name]__[hash:base64:5].[ext]',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.(ico|eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
        exclude: Conf.MODULES
      }
    ]
    // noParse: /node_modules/
  }
}
