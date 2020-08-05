import React, { Component } from 'react'
import List from 'rc-virtual-list'
import { RESULT_HEIGHT } from '@/constants/ui'

import Row from './Row'
import styles from './styles.css'

class ResultsList extends Component {
  constructor(props) {
    super(props)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.focusInputFirst = !props.mainInputFocused
  }

  rowRenderer(title, index) {
    const result = this.props.results[index]
    const { mainInputFocused, selected, onItemHover } = this.props

    const attrs = {
      ...result,
      // TODO: think about events
      // In some cases action should be executed and window should be closed
      // In some cases we should autocomplete value
      selected: index === this.props.selected,
      onSelect: (event) => {
        this.props.onSelect(result, event)
      },
      // Move selection to term under cursor
      onMouseMove: (event) => {
        const { movementX, movementY } = event.nativeEvent
        if (index === selected || !mainInputFocused) {
          return
        }
        if (movementX || movementY) {
          // Hover term only when we had real movement of mouse
          // We should prevent changing of selection when user uses keyboard
          onItemHover(index)
        }
      },
      key: result.id
    }
    return <Row {...attrs} />
  }

  renderPreview() {
    const selected = this.props.results[this.props.selected]
    if (!selected.getPreview) {
      return null
    }
    const preview = selected.getPreview()
    if (typeof preview === 'string') {
      // Fallback for html previews intead of react component
      // FIXME XSS Problem?
      return <div dangerouslySetInnerHTML={{ __html: preview }} />
    }
    return preview
  }

  render() {
    const { results, selected, visibleResults, mainInputFocused } = this.props
    const classNames = [styles.resultsList, mainInputFocused ? styles.focused : styles.unfocused].join(' ')
    if (results.length === 0) {
      return null
    }

    return (
      <div className={styles.wrapper}>
        <List
          className={classNames}
          data={results.map((result) => result.title)}
          height={visibleResults * RESULT_HEIGHT}
          itemHeight={RESULT_HEIGHT}
          itemKey="title"
        >
          {(title, index) => this.rowRenderer(title, index)}
        </List>

        <div className={styles.preview} id="preview">
          {this.renderPreview()}
        </div>
      </div>
    )
  }
}

export default ResultsList
