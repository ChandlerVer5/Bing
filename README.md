# Intro

!!!WIP!!! Unable to work at present!!!

Most of the code source comes from [cerebro](https://github.com/KELiON/cerebro),renamed MyBing!!!

Cerebro and [uTools](https://u.tools) plug-in system are integrated

通过修改 cerebro, 1：完成自己想要的功能，2：移植 utools 插件！(Partial code refer to Utools)

# Dev

1. 插件 的拖拽，在各个平台不一致问题！
   主要文件：`@/common/windowMove.js`
   目前主要是 drag_layer 层设置 `-webkit-app-region: no-drag`,在 Mac 下完美，未测试其他平台

## 插件路径

mac:`/Users/bing/Library/Application Support/MyBing/plugins/`

# TODO

utools 插件：upx (基本完成)

unicode webpack 打包优化

## 注意事项

uTools 插件中不受跨域影响，可以访问任意网址
无需网页考虑兼容性问题，基于（Chromium 76 和 Node 12）
在插件开发模式中，可以使用 http 协议加载远程资源（js、css）。当打包成 uTools 插件后，所有的静态资源都应该在包内，否则会加载失败。
需要在 plugin.json 同级目录下放一个 README.md 文件来介绍你的插件，在 uTools 的多处地方显示。(文件名区分大小写，名称大写、后缀小写)

# Problems

1. window 权限，无法拖拽！：https://github.com/electron/electron/issues/12460

# Refs

https://u.tools/
https://hub.fastgit.org/oliverschwendener/ueli
https://hub.fastgit.org/tinytacoteam/zazu
https://hub.fastgit.org/KELiON/cerebro
https://hub.fastgit.org/hainproject/hain

<!-- "chokidar": "^1.6.1", -->
