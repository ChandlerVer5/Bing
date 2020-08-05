const path = require('path')

const ROOT = path.resolve(__dirname, '../')
const SRC = path.resolve(ROOT, './src')
const OUTPUT = path.resolve(ROOT, './app')
const MODULES = path.resolve(ROOT, './node_modules')

// 入口文件
const ENTRY = path.resolve(SRC, './renderer/index')

const PORT = 3006

const INCLUDE = [SRC]

module.exports = {
  ROOT,
  SRC,
  OUTPUT,
  MODULES,
  ENTRY,
  PORT,
  INCLUDE
}
