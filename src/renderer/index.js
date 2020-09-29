import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Bing from './components/Bing'
import { makeDraggable } from '@/common/windowMove'

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

// make main window Draggable
// makeDraggable('#root')

// init configs
initAll(store)
