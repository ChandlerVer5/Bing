//  APi from main process for renderer
/**
 * @description get electron core module! no matter main or  renderer
 * @param {string} moduleName 模块名 例如:app
export function getCoreModule(moduleName) {
  return electron[moduleName] || electron.remote[moduleName]
}
*/
global.services = {}

export default (object = {}) => {
  if (typeof object === 'object') Object.assign(global.services, object)
}
