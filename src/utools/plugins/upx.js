import zlib from 'zlib'
import fs from 'fs'
import path from 'path'

/**
 * @description 插件管理中心！当安装新插件一周，需要及时搜索到插件！
 */
/**
 * @description retrieve\download something...
 * update\remove\
 *
 */
/**
 * @description Unpack asar file from upx
 */
function upxUnPack(upxFile) {
  const sourcePath = path.join(__dirname, upxFile)
  const filePath = path.join(__dirname, path.basename(upxFile, '.upx'))
  const unzip = zlib.createGunzip()
  const ws = fs.createWriteStream(filePath)
  fs.createReadStream(sourcePath).pipe(unzip).pipe(ws)
}

/**
 * @description pack asar file from asar
 *
 */
function upxPack(upxFile) {
  const e = fs.createReadStream(upxFile),
    n = path.join(__dirname, 'npm' + '-' + '0.1.2' + '.upx'),
    r = fs.createWriteStream(n),
    a = zlib.createGzip()
  e.pipe(a)
    .on('error', () => new Error('压缩错误'))
    .pipe(r)
    .on('error', () => new Error('压缩写入错误'))
    .on('finish', () => {
      try {
        //							fs.unlinkSync(o)
      } catch (e) {}
    })
}

// upxPack('/Volumes/Mac/Users/bing/Documents/npmLook-0.1.2.asar')
