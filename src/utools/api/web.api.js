/**
 * @description for  mainWindow can invoke this api,JUST FOR WEB
 */

export default function upxWindowApi(registerData = {}) {
  window.upxApi = Object.assign((window.upxApi = {}), registerData)
  console.log('upxApi', window.upxApi)
}
