const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Conf = require('./config')
const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  context: Conf.ROOT,
  devtool: 'source-map',
  entry: {
    // polyfills: ["@babel/polyfill", "event-source-polyfill"],
    // vendor: ['react', 'react-dom', 'prop-types'],
    renderer: Conf.ENTRY,
    detach: `${Conf.SRC}/utools/detach/index.js`
  },
  output: {
    path: Conf.OUTPUT,
    publicPath: '../', // detach chunk correct path!
    filename: (chunkData) => (chunkData.chunk.name === 'detach' ? 'detach/[name].bundle.js' : '[name].bundle.js')
    // libraryTarget: 'umd'
  },

  module: {
    rules: [
      // 报错的source-map
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
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
    new webpack.NamedModulesPlugin(), // 用于启动 HMR时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // hot module replacement 启动模块热替换的插件
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'cerebro',
      filename: 'index.html',
      template: `${Conf.SRC}/index.html`,
      hash: true,
      chunks: ['renderer']
    }),
    new HtmlWebpackPlugin({
      title: 'cerebro',
      filename: 'detach/index.html',
      template: `${Conf.SRC}/utools/detach/index.html`,
      hash: true,
      chunks: ['detach']
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify('development')
    }),
    new CopyWebpackPlugin({
      options: {
        concurrency: 5
      },
      patterns: [
        {
          from: `${Conf.SRC}/assets`,
          to: `${Conf.OUTPUT}/assets`
        },
        {
          from: `${Conf.SRC}/styles`,
          to: `${Conf.OUTPUT}/styles`,
          force: true
        }
      ]
    })
  ],

  devServer: {
    contentBase: Conf.OUTPUT,
    disableHostCheck: true,
    writeToDisk: true,

    /*     stats: {
      colors: true,
      chunks: false,
      children: false
    }, */

    before() {
      console.log('Starting Main Process...')
      spawn('npm', ['run', 'start-electron'], {
        // 在运行这个 server 之前会运行 package.json 里的`start-electron`指令
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', (code) => process.exit(code))
        .on('error', (spawnError) => console.error(spawnError))

      /* spawn('electron', ['main/index.js'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', (code) => process.exit(0))
        .on('error', (spawnError) => console.error(spawnError)) */
    }
  },

  target: 'electron-renderer'
})
