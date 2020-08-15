/**
 * @description for  mainWindow can invoke this api,JUST FOR WEB
 */

const setSubInput = (...params) => {
  console.log(params)
  return 'mainWindow can invoke this api'
}

export default function upxWindowApi() {
  window.upxApi = {
    setSubInput
  }
}
