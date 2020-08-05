const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const Conf = require('./config')

module.exports = {
  mode: process.env.NODE_ENV,
  context: Conf.ROOT,
  resolve: {
    modules: ['node_modules', Conf.MODULES],
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
    new LodashModuleReplacementPlugin()
  ],
  node: {
    __dirname: false,
    __filename: false
  },
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
        exclude: Conf.MODULES,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(webp|jpe?g|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name]__[hash:base64:5].[ext]',
            publicPath: '../'
          }
        },
        exclude: Conf.MODULES
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
