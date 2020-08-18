import React, { useEffect, useRef, useState } from 'react'
import styles from './input.scss'

// 拖动移动三兄弟
function windowMove(canMove) {
  return MainRpc.rendererSend('window-move-open', canMove)
}

const onMouseDown = (e) => windowMove(true)

const getTextWidth = (el, value) => {
  // uses a cached canvas if available
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  // get the full font style property

  const font = window.getComputedStyle(el, null).getPropertyValue('font')
  context.font = font
  const text = value || el.value
  // set the font attr for the canvas text
  return context.measureText(text).width
}

const UpxInput = (props) => {
  const subInputRef = useRef(null)
  const dragLayerRef = useRef(null)
  const { term, selected, feature } = props

  const [inputValue, setInputValue] = useState('')

  /**
   * Handle keyboard shortcuts
   */
  const onKeyDown = (event) => {
    console.log(event.key, event.keyCode, event.metaKey, event.ctrlKey, event.altKey)

    if (event.defaultPrevented) {
      return
    }

    const keyActions = {
      select: () => {}
    }

    if (event.metaKey || event.ctrlKey) {
      if (event.keyCode === 81) {
        // clear Input on cmd+q
        clearInput(event)
      }
    }

    /* switch (event.keyCode) {
      case 13: // Enter
        keyActions.select()
        break
    } */
  }

  // input action

  const clearInput = () => {
    setInputValue('')
  }
  const focusInput = () => {
    subInputRef.current.focus()
  }

  const onMouseUp = (e) => {
    windowMove(false)
    focusInput()
  }

  const onDocumentKeydown = (event) => {
    // Escape
    if (event.keyCode === 27) {
      event.preventDefault()
      focusInput()
      if (event.target.value) {
        clearInput()
      } else {
        window.UpxRpc.closeUpx(feature.upxId)
      }
    }
  }

  const onValueChange = (e, txt) => {
    const width = txt === 0 ? txt : Math.floor(getTextWidth(subInputRef.current, txt))
    const inputText = txt || subInputRef.current.value
    dragLayerRef.current.style.left = `${width + 58}px`
    inputText && window.UpxRpc.sendUpxEvent(feature.upxId, 'input', inputText)
    setInputValue(inputText)
  }

  useEffect(() => {
    console.log(dragLayerRef, props)

    window.addEventListener('keydown', onDocumentKeydown)

    window.upxApi.setSubInput = ({ placeholder, isFocus }) => {
      isFocus ? focusInput() : subInputRef.current.blur()
      if (placeholder) {
        clearInput()
        dragLayerRef.current.style.left = `58px`
        subInputRef.current.setAttribute('placeholder', placeholder)
      }
    }
    window.upxApi.setSubInputValue = ({ value }) => {
      onValueChange(null, value)
    }

    window.upxApi._clearInput = () => clearInput()
    window.upxApi._focusInput = () => focusInput()

    return () => {
      // unmount will do!
      window.removeEventListener('keydown', onDocumentKeydown)
      // window.removeEventListener('beforeunload',cleanup)
    }
  }, [])

  // menu!
  const showMenu = (e) => {
    console.log(e, props)
    UpxRpc.showUpxMenu(feature.upxId)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <>
      <div className={styles.tag} onClick={showMenu}>
        {/* <img className={styles.tag} src={feature.icon} alt="" /> */}
        <img src="https://www.easyicon.net/api/resizeApi.php?id=1266721&size=128" alt="" />
      </div>
      <input ref={subInputRef} value={inputValue} onChange={onValueChange} onKeyDown={onKeyDown} type="text" id="main-input" className={styles.subInput} />
      <div ref={dragLayerRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className={styles.drag_layer} />
      {/* </div> */}
    </>
  )
}

export default UpxInput
