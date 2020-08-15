import zlib from 'zlib'
import fs from 'fs'
import path from 'path'

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
 * @description pack asar file from upx
 *
 */
function upxPack(upxFile) {
  const sourcePath = path.join(__dirname, upxFile)
  const filePath = path.join(__dirname, path.basename(upxFile, '.upx'))
  const unzip = zlib.createZip()
  const ws = fs.createWriteStream(filePath)
  fs.createReadStream(sourcePath).pipe(unzip).pipe(ws)
}
