// eslint-disable-next-line node/no-deprecated-api
import { parse } from 'url'

import showWinWithTerm from './show-win-with-term'

export default (mainWindow, url) => {
  const { host: action, query } = parse(url, { parseQueryString: true })
  // Currently only search action supported.
  // We can extend this handler to support more
  // like `plugins/install` or do something plugin-related
  if (action === 'search') {
    showWinWithTerm(mainWindow, query.term)
  } else {
    showWinWithTerm(mainWindow, url)
  }
}
