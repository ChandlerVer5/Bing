import React, { useEffect, useRef, useState } from 'react'
import execJS from '../api/execJs'
import styles from './input.scss'

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
  let [showUpxName, setUpxName] = useState(false)

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
  const setDragLayer = (width = 0) => (dragLayerRef.current.style.left = `${width + 54}px`)

  const toggleUpxName = (bool = false) => {
    subInputRef.current.style.display = bool ? 'none' : 'block'
    setUpxName(bool)
    bool && setDragLayer()
  }

  const focusInput = (bool = true) => {
    subInputRef.current[bool ? 'focus' : 'blur']()
  }

  const onDragClick = (e) => {
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
    setDragLayer(width)
    inputText && window.UpxRpc.sendUpxEvent(feature.upxId, 'input', inputText)
    setInputValue(inputText)
  }

  useEffect(() => {
    console.log(dragLayerRef, props)
    window.addEventListener('keydown', onDocumentKeydown)

    window.upxApi.setSubInput = ({ placeholder, isFocus }) => {
      toggleUpxName(false)
      isFocus ? focusInput() : subInputRef.current.blur()
      if (placeholder) {
        clearInput()
        setDragLayer()
        subInputRef.current.setAttribute('placeholder', placeholder)
      }
    }

    window.upxApi.setSubInputValue = ({ value }) => {
      toggleUpxName(false)
      onValueChange(null, value)
    }
    window.upxApi.subInputSelect = () => subInputRef.current.select()

    window.upxApi.removeSubInput = () => {
      toggleUpxName(true)
    }
    window.upxApi.subInputFocus = () => focusInput()
    window.upxApi.subInputBlur = () => focusInput(false)

    return () => {
      // unmount will do!
      window.removeEventListener('keydown', onDocumentKeydown)
      // window.removeEventListener('beforeunload',cleanup)
    }
  }, [])

  // menu!
  const showMenu = (e) => {
    UpxRpc.showUpxMenu(feature.upxId)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <>
      <div className={styles.tag} onClick={showMenu}>
        <img src={feature.icon} alt={feature.title} />
      </div>
      <input ref={subInputRef} value={inputValue} onChange={onValueChange} onKeyDown={onKeyDown} type="text" id="main-input" className={styles.subInput} />
      <div ref={dragLayerRef} onClick={onDragClick} className={styles.drag_layer}>
        <span style={{ display: showUpxName ? 'block' : 'none' }} className={[styles.name, 'no-select'].join(' ')}>
          {feature.upxName}
        </span>
      </div>
    </>
  )
}

export default UpxInput
