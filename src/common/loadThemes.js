/**
 * Load all available themes
 * @return {Array<Object>} Array of objects {value, label}.
 *                         Label is text that is shown in preferences theme selector
 */
export default () => {
  const prefix = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : '../'
  // const prefix = __dirname

  return [
    {
      value: `${prefix}/styles/themes/light.css`,
      label: 'Light'
    },
    {
      value: `${prefix}/styles/themes/dark.css`,
      label: 'Dark'
    }
  ]
}
