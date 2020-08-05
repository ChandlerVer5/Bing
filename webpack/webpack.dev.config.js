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
    main: Conf.ENTRY
  },
  output: {
    path: Conf.OUTPUT,
    publicPath: '/',
    filename: 'renderer.bundle.js'
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
      hash: true
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
        // 在运行这个server之前会运行package.json里的`start-main-dev`指令，文章下面会配置。
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
