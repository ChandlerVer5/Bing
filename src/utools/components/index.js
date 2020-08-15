import React, { useState, useCallback, useEffect, useRef } from 'react'
import SubInput from './subInput'
import styles from './styles.scss'

export default (props) => {
  const inputRef = useRef(null)
  //  <IUtools term={this.props.term} feature={this.props.results[0]} selected={this.props.selected} />
  const { term, feature } = props

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

    switch (event.keyCode) {
      case 8: // Backspace 8
        clearInput(event)
        break
      case 13: // Enter
        keyActions.select()
        break
    }
  }

  const clearInput = () => {
    inputRef.current.children[0].value = ''
  }

  /*const tagElement = useCallback((node) => {
    if (node !== null) {
      console.log(node.getBoundingClientRect().width)
      setTagWidth(node.getBoundingClientRect().width + 2)
    }
  }) */

  useEffect(() => {
    // inputRef.current.click()
    // inputRef.current.children[0].setAttribute('placeholder', 'NMDEDE')
    // console.log(inputRef.current.children)
  }, [])

  return (
    <>
      <div className={styles.tag}>
        {/* <img className={styles.tag} src={feature.icon} alt="" /> */}
        <img src="https://www.easyicon.net/api/resizeApi.php?id=1266721&size=128" alt="" />
      </div>
      <SubInput ref={inputRef} term={term} upx={feature} onKeyDown={onKeyDown} />
    </>
  )
}
