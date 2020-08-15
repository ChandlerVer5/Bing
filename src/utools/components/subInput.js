import React, { useEffect, useRef, forwardRef } from 'react'
import styles from './subInput.scss'

// 拖动移动三兄弟
function windowMove(canMove) {
  return mainRpc.rendererSend('window-move-open', canMove)
}

const onMouseDown = (e) => windowMove(true)

const onMouseUp = (e) => {
  // focus()
  windowMove(false)
}

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

const SubInput = (props, ref) => {
  const subInputRef = useRef(null)
  const dragLayerRef = useRef(null)
  const { term } = props

  const setSubInputFocus = () => {
    subInputRef.current.focus()
  }

  useEffect(() => {
    console.log(dragLayerRef, props, window.upxApi)
    window.upxApi.setSubInput = ({ placeholder, isFocus }) => {
      const subInputEl = subInputRef.current
      isFocus ? subInputEl.focus() : subInputEl.blur()
      subInputEl.setAttribute('placeholder', placeholder)
    }
    window.upxApi.setSubInputValue = ({ value }) => {
      subInputRef.current.value = value
      upxRpc.sendUpxEvent(props.upx.upxId, 'input', value)
    }

    setTimeout(() => {
      subInputRef.current.focus()
    }, 1000)
  }, [])

  const onInput = (e, txt) => {
    const width = txt === 0 ? txt : Math.floor(getTextWidth(e.target, txt))
    dragLayerRef.current.style.left = `${width + 52}px`
    upxRpc.sendUpxEvent(props.upx.upxId, 'input', e.target.value)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <>
      {/* <div onClick={setSubInputFocus} ref={ref}> */}
      <input ref={subInputRef} onInput={onInput} type="text" id="main-input" className={styles.subInput} onKeyDown={props.onKeyDown} />
      <div ref={dragLayerRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className={styles.drag_layer} />
      {/* </div> */}
    </>
  )
}

export default forwardRef(SubInput)
