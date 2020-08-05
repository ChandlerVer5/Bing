module.exports = {
  extensions: ['.js', '.jsx'],
  ignore: [/\/(build|dist|node_modules)\//],
  root: '../src',
  presets: [
    [
      '@babel/preset-env',
      {
        // eslint-disable-next-line global-require
        targets: { electron: require('electron/package.json').version },
        // useBuiltIns: 'usage',
        // corejs: '3',
        loose: true,
        modules: 'commonjs'
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['babel-plugin-webpack-alias', { config: './webpack/webpack.base.config.js' }]
  ]
}
