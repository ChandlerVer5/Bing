const readPackageJson = () =>
  new Promise((resolve, reject) => {
    try {
      const json = mainRpc.pluginClient.pluginConfigs()
      resolve(json)
    } catch (error) {
      reject(error)
    }
  })

/**
 * Get list of all installed plugins with versions
 *
 * @return {Promise<Object>}
 */
export default () => readPackageJson().then((json) => ({ ...json.cerebro, ...json.utools }))
