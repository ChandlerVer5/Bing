const { merge } = require('webpack-merge')
const Conf = require('./config')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  entry: {
    preload: `${Conf.SRC}/preload/preload.js`
  },
  output: {
    // publicPath: path.resolve(__dirname, 'app'),
    publicPath: '/',
    filename: '[name].js',
    path: Conf.OUTPUT
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
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
  target: 'electron-preload'
})
