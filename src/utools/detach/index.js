const platform = window.DetachRpc.getPlatform()

// 键盘按下
const sendPluginSomeKeyDownEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const modifiers = []
  if (e.ctrlKey) modifiers.push('control')
  if (e.shiftKey) modifiers.push('shift')
  if (e.altKey) modifiers.push('alt')
  if (e.metaKey) modifiers.push('meta')
  window.DetachRpc.sendPluginSomeKeyDownEvent(e.code, modifiers)
}

function initSubInputEvent() {
  const inputDom = document.querySelector('input')
  let subInputDelayTimers = null
  const inputChange = (value) => {
    if (subInputDelayTimers) {
      clearTimeout(subInputDelayTimers)
    }
    subInputDelayTimers = setTimeout(() => {
      subInputDelayTimers = null
      window.DetachRpc.sendSubInputChangeEvent(value)
    }, 60)
  }

  let inputLock = false
  inputDom.addEventListener('compositionstart', () => {
    inputLock = true
  })
  inputDom.addEventListener('compositionend', (e) => {
    inputLock = false
    inputChange(e.target.value)
  })
  inputDom.addEventListener('input', (e) => {
    if (inputLock) return
    inputChange(e.target.value)
  })

  inputDom.addEventListener('keydown', (e) => {
    if (e.keyCode === 229) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (e.code === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      e.target.value = ''
      inputDom.dispatchEvent(new window.Event('input'))
      return
    }
    if (e.code === 'ArrowRight') {
      if (e.target.selectionEnd === e.target.value.length && e.target.selectionStart === e.target.selectionEnd) {
        sendPluginSomeKeyDownEvent(e)
      }
      return
    }
    if (e.code === 'ArrowLeft') {
      if (e.target.selectionEnd === 0 && e.target.selectionStart === e.target.selectionEnd) {
        sendPluginSomeKeyDownEvent(e)
      }
      return
    }
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'NumpadEnter'].includes(e.code)) {
      sendPluginSomeKeyDownEvent(e)
      return
    }
    if (platform === 'darwin') {
      if (e.ctrlKey || e.metaKey) {
        if (e.metaKey) {
          if (['KeyV', 'KeyX', 'KeyA', 'KeyZ', 'KeyW', 'KeyQ'].includes(e.code)) return
          if (e.code === 'KeyC' && e.target.selectionStart !== e.target.selectionEnd) return
        }
        sendPluginSomeKeyDownEvent(e)
      }
    } else {
      if (e.ctrlKey || e.altKey) {
        if (e.ctrlKey) {
          if (['KeyV', 'KeyX', 'KeyA', 'KeyZ', 'KeyW'].includes(e.code) && e.ctrlKey) return
          if (e.code === 'KeyC' && e.target.selectionStart !== e.target.selectionEnd) return
        }
        if (e.altKey && e.code === 'F4') return
        sendPluginSomeKeyDownEvent(e)
      }
    }
  })

  inputDom.addEventListener('blur', () => {
    window.subInputBlurTimestamp = Date.now()
  })
}

window.render = ({ featureCode, icon, label, subInput, isDev, isMaximizable, isPluginInfo, isDarkColors }) => {
  window.payload = { featureCode, icon, label, subInput }
  const headerDOM = document.querySelector('header')
  headerDOM.style.backgroundColor = isDarkColors ? '#2B2C2D' : '#E7EAED'
  headerDOM.style.color = isDarkColors ? '#F1F2F3' : '#3C4043'
  document.body.className = isDarkColors ? 'dark-mode' : ''
  headerDOM.innerHTML = `
  <div class='${platform}'>
    <div class='title' style='padding-top:${subInput ? '13px; -webkit-app-region: no-drag;' : '15px'}' ${subInput ? "onclick='handle.focus()'" : ''}>
      <img alt='${label}' src='${icon}'>
      ${
        subInput
          ? `<input type='text' autofocus
      placeholder=${JSON.stringify(subInput.placeholder || '')}
      value=${JSON.stringify(subInput.value || '')}
      onfocus='this.selectionStart = this.selectionEnd = this.value.length;' />`
          : label
      }
    </div>
    <div class='handle'>
      ${isDev ? '<div class="devtool" onclick="handle.openDevTool()" title="开发者工具"></div>' : ''}
      ${isPluginInfo ? '<div class="plugininfo" onclick="handle.showInfoMenu()" title="插件信息"></div>' : ''}
      <div class='settingmenu' onclick='handle.showSettingMenu()' title='插件选项'></div>
      <div class='unpin' onclick='handle.pin()' title='窗口置顶'></div>
      ${
        platform === 'darwin'
          ? ''
          : `
        <div class='minimize' onclick='handle.minimize()'></div>
        <div class='maximize' onclick='handle.maximize()'></div>
        <div class='close' title="关闭" onclick='handle.close()'></div>
      `
      }
    </div>
  </div>`
  if (subInput) initSubInputEvent()
}

window.handle = {
  openDevTool: window.DetachRpc.openDevTool,
  pin: () => {
    const btnPin = document.querySelector('.unpin')
    if (btnPin.classList.contains('pin')) {
      window.DetachRpc.setAlwaysOnTop(false)
      btnPin.classList.remove('pin')
      btnPin.title = '窗口置顶'
    } else {
      window.DetachRpc.setAlwaysOnTop(true)
      btnPin.classList.add('pin')
      btnPin.title = '取消置顶'
    }
  },
  close: window.DetachRpc.closeWindow,
  minimize: window.DetachRpc.minimizeWindow,
  maximize: () => {
    if (document.querySelector('.maximize').className.includes('unmaximize')) {
      window.DetachRpc.unmaximizeWindow()
    } else {
      window.DetachRpc.maximizeWindow()
    }
  },
  focus: window.DetachRpc.webContentsFocus,
  showSettingMenu: window.DetachRpc.buildDetachPluginOptionMenu,
  showInfoMenu: window.DetachRpc.buildDetachPluginInfoMenu
}

window.upxApi = {
  setSubInput: (subInput) => {
    const titleDom = document.querySelector('.title')
    if (!titleDom) return
    window.payload.subInput = subInput
    titleDom.outerHTML = `<div class='title' style='padding-top:13px; -webkit-app-region: no-drag;' onclick='handle.focus()'>
    <img alt='' src='${window.payload.icon}'>
    <input type='text' autofocus placeholder=${JSON.stringify(subInput.placeholder || '')}
    onfocus='this.selectionStart = this.selectionEnd = this.value.length;' /></div>`
    initSubInputEvent()
  },
  removeSubInput: () => {
    const titleDom = document.querySelector('.title')
    if (!titleDom) return
    window.payload.subInput = null
    titleDom.outerHTML = `<div class='title' style='padding-top:15px;'><img alt='' src='${window.payload.icon}'>${window.payload.label}</div>`
  },
  setSubInputValue: ({ value }) => {
    console.log('setSubInputValue', value)
    const inputDom = document.querySelector('input')
    if (!inputDom) return
    inputDom.value = value
    inputDom.dispatchEvent(new window.Event('input'))
  },
  subInputSelect: () => {
    const inputDom = document.querySelector('input')
    if (!inputDom) return
    inputDom.select()
  },
  subInputFocus: () => {
    const inputDom = document.querySelector('input')
    if (!inputDom) return
    inputDom.focus()
  }
}

if (platform === 'darwin') {
  window.addEventListener('keydown', (e) => {
    if (e.metaKey && (e.code === 'KeyW' || e.code === 'KeyQ')) {
      window.DetachRpc.closeWindow()
    }
  })
} else {
  window.DetachRpc.setWindowMaximizeEvent(
    () => {
      const btnMaximize = document.querySelector('.maximize')
      btnMaximize.classList.add('unmaximize')
    },
    () => {
      const btnMaximize = document.querySelector('.maximize')
      btnMaximize.classList.remove('unmaximize')
    }
  )
}
