import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Bing from './components/Bing'

import initAll from './init'

import store from './store'
import '../styles/global.css'
import '../styles/themes/light.css'

ReactDOM.render(
  <Provider store={store}>
    <Bing />
  </Provider>,
  document.getElementById('root')
)

initAll(store)
