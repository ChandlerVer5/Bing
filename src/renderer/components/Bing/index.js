/* eslint-disable react/react-in-jsx-scope */
/* eslint default-case: 0 */
import { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { focusableSelector } from '@/cerebro-ui'
import escapeStringRegexp from 'escape-string-regexp'
import debounce from 'lodash/debounce'
import dragListener from 'drag-drop'

import { WINDOW_WIDTH, INPUT_HEIGHT, RESULT_HEIGHT, MIN_VISIBLE_RESULTS } from '@/constants/ui'
import * as searchActions from '@/renderer/actions/search'
// for utools
import IUtools from '@/utools/components'
import upxWindowApi from '@/utools/api/web.api'

import MainInput from '../MainInput'
import ResultsList from '../ResultsList'
import StatusBar from '../StatusBar'
import styles from './styles.css'

const SHOW_EVENT = {
  category: 'Window',
  event: 'show'
}

const SELECT_EVENT = {
  category: 'Plugins',
  event: 'select'
}

const trackShowWindow = () => mainRpc.trackEvent(SHOW_EVENT)
const trackSelectItem = (label) => mainRpc.trackEvent({ ...SELECT_EVENT, label })

/**
 * Wrap click or mousedown event to custom `select-term` event,
 * that includes only information about clicked keys (alt, shift, ctrl and meta)
 *
 * @param  {Event} realEvent
 * @return {CustomEvent}
 */
const wrapEvent = (realEvent) => {
  const event = new CustomEvent('select-term', { cancelable: true })
  event.altKey = realEvent.altKey
  event.shiftKey = realEvent.shiftKey
  event.ctrlKey = realEvent.ctrlKey
  event.metaKey = realEvent.metaKey
  return event
}

/**
 * Set focus to first focusable element in preview
 */
const focusPreview = () => {
  const previewDom = document.getElementById('preview')
  const firstFocusable = previewDom.querySelector(focusableSelector)
  if (firstFocusable) {
    firstFocusable.focus()
  }
}

/**
 * Check if cursor in the end of input
 *
 * @param  {DOMElement} input
 */
const cursorInEndOfInut = ({ selectionStart, selectionEnd, value }) =>
  typeof value !== 'undefined' && selectionStart === selectionEnd && selectionStart >= value.length

/**
 * Main search container
 *
 * TODO: Remove redux
 * TODO: Split to more components
 */
class Cerebro extends Component {
  constructor(props) {
    super(props)
    this.mainWindow = mainRpc.currentWindow()
    this.onWindowResize = debounce(this.onWindowResize, 100).bind(this)
    this.updateMainWindow = debounce(this.updateMainWindow, 16).bind(this)

    this.onMainInputFocus = this.onMainInputFocus.bind(this)
    this.onMainInputBlur = this.onMainInputBlur.bind(this)

    this.mainInputRef = createRef()
    this.inputWrapperRef = createRef()
    this.state = {
      mainInputFocused: false,
      dragEnterStyle: null,
      isUpx: false
    }
  }

  UNSAFE_componentWillMount() {
    // Listen for window.resize and change default space for results to user's value
    window.addEventListener('resize', this.onWindowResize)
    // Add some global key handlers
    window.addEventListener('keydown', this.onDocumentKeydown)
    // Cleanup event listeners on unload
    // NOTE: when page refreshed (location.reload) componentWillUnmount is not called
    window.addEventListener('beforeunload', this.cleanup)
    this.mainWindow.on('show', () => {
      this.focusMainInput()
      this.updateMainWindow()
      trackShowWindow()
    })
  }

  componentDidMount() {
    this.focusMainInput()
    this.updateMainWindow()

    // 文件拖拽
    dragListener(this.inputWrapperRef.current, {
      // eslint-disable-next-line max-params
      onDrop: (files, pos, fileList, directories) => {
        console.log('Here are the dropped files', files)
        console.log('Dropped at coordinates', pos.x, pos.y)
        console.log('Here is the raw FileList object if you need it:', fileList)
        console.log('Here is the list of directories:', directories)
      },
      onDragEnter: () => {
        !this.state.isUpx &&
          this.setState({
            dragEnterStyle: { backgroundColor: '#6f8db3' }
          })
      },
      onDragLeave: () => {
        !this.state.isUpx &&
          this.setState({
            dragEnterStyle: null
          })
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps.term || this.props.results.length !== nextProps.results.length || this.props.selected !== nextProps.selected) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    const { results } = this.props
    if (results.length !== prevProps.results.length) {
      // Resize electron window when results count changed
      this.updateMainWindow()
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  /**
   * Handle keyboard shortcuts
   */
  onKeyDown = (event) => {
    const highlighted = this.highlightedResult()
    // TODO: go to first result on cmd+up and last result on cmd+down
    if (highlighted && highlighted.onKeyDown) {
      highlighted.onKeyDown(event)
    }
    if (event.defaultPrevented) {
      return
    }

    const keyActions = {
      select: () => {
        this.selectCurrent(event)
      },
      arrowRight: () => {
        if (cursorInEndOfInut(event.target) && !!event.target.value) {
          if (this.autocompleteValue()) {
            // Autocomplete by arrow right only if autocomple value is shown
            this.autocomplete(event) // 接着处理下一项
          } else {
            focusPreview()
            event.preventDefault()
          }
        }
      },
      arrowDown: () => {
        this.props.actions.moveCursor(1)
        event.preventDefault()
      },
      arrowUp: () => {
        if (this.props.results.length > 0) {
          this.props.actions.moveCursor(-1)
        } else if (this.props.prevTerm) {
          this.props.actions.updateItem(this.props.prevTerm)
        }
        event.preventDefault()
      }
    }

    if (event.metaKey || event.ctrlKey) {
      if (event.keyCode === 191) {
        // clear Input on cmd+/
        this.clearMainInput(event)
      }
      if (event.keyCode === 67) {
        // Copy to clipboard on cmd+c
        const text = this.highlightedResult().clipboard
        if (text) {
          mainRpc.copyToClipboard(text)
          this.props.actions.reset()
          event.preventDefault()
        }
        return
      }
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        // Select element by number
        const number = Math.abs(49 - event.keyCode)
        const result = this.props.results[number]
        if (result) {
          this.selectItem(result)
        }
      }
      // Lightweight vim-mode: cmd/ctrl + jklo
      switch (event.keyCode) {
        // J
        case 74:
          keyActions.arrowDown()
          break
        // K
        case 75:
          keyActions.arrowUp()
          break
        // L
        case 76:
          keyActions.arrowRight()
          break
        // O
        case 79:
          keyActions.select()
          break
      }
    }

    switch (event.keyCode) {
      case 9: // Tab
        this.autocomplete(event)
        break
      case 39: // Right
        keyActions.arrowRight()
        break
      case 40: // Down
        keyActions.arrowDown()
        break
      case 38: // ArrowUp 38
        keyActions.arrowUp()
        break
      case 13: // Enter
        keyActions.select()
        break
    }
  }

  onDocumentKeydown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault()
      this.focusMainInput()
      this.clearMainInput(event)
    }
  }

  /**
   * Handle resize window and change count of visible results depends on window size
   */
  onWindowResize() {
    if (this.props.results.length > MIN_VISIBLE_RESULTS) {
      let visibleResults = Math.floor((window.outerHeight - INPUT_HEIGHT) / RESULT_HEIGHT)
      visibleResults = Math.max(MIN_VISIBLE_RESULTS, visibleResults)
      if (visibleResults !== this.props.visibleResults) {
        this.props.actions.changeVisibleResults(visibleResults)
      }
    }
  }

  onMainInputFocus() {
    this.setState({ mainInputFocused: true })
  }

  onMainInputBlur() {
    this.setState({ mainInputFocused: false })
  }

  // unmount will do!
  cleanup = () => {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onDocumentKeydown)
    window.removeEventListener('beforeunload', this.cleanup)
    !this.state.isUpx &&
      this.mainWindow.removeListener('show', () => {
        this.focusMainInput()
        this.updateMainWindow()
        trackShowWindow()
      })
  }

  focusMainInput = () => {
    this.mainInputRef.current.focus()
  }

  /**
   * Select term from results list
   * @param  {[type]} term [description]
   * @return {[type]}      [description]
   */
  selectItem = (term, realEvent) => {
    this.props.actions.reset()
    trackSelectItem(term.plugin)
    const event = wrapEvent(realEvent)
    // if (!event.defaultPrevented) {
    //   mainRpc.currentWindow().hide()
    // }
    term.onSelect(event) // from autocomplete

    if (term.upxId) {
      this.setState({ isUpx: true })
      upxWindowApi()
      this.cleanup()
    }
  }

  /**
   * Get highlighted result
   * @return {Object}
   */
  highlightedResult() {
    return this.props.results[this.props.selected]
  }

  clearMainInput(event) {
    if (cursorInEndOfInut(event.target)) {
      !event.target.value && mainRpc.currentWindow().hide()
      this.mainInputRef.current.onInput(event, 0)
      this.props.actions.updateItem('')
      event.preventDefault()
    }
  }

  /**
   * Set resizable and size for main electron window when results count is changed
   */
  updateMainWindow() {
    const { results, visibleResults } = this.props
    const { length } = results
    const win = this.mainWindow
    const [width] = win.getSize()

    // When results list is empty window is not resizable
    win.setResizable(length !== 0)

    if (length === 0) {
      win.setMinimumSize(WINDOW_WIDTH, INPUT_HEIGHT)
      win.setSize(width, INPUT_HEIGHT)
      win.setPosition(...mainRpc.getWinPosition({ width }))
      return
    }

    const resultHeight = Math.max(Math.min(visibleResults, length), MIN_VISIBLE_RESULTS)
    const heightWithResults = resultHeight * RESULT_HEIGHT + INPUT_HEIGHT
    const minHeightWithResults = MIN_VISIBLE_RESULTS * RESULT_HEIGHT + INPUT_HEIGHT
    win.setMinimumSize(WINDOW_WIDTH, minHeightWithResults)
    win.setSize(width, heightWithResults)
    win.setPosition(...mainRpc.getWinPosition({ width, heightWithResults }))
  }

  /**
   * Autocomple search term from highlighted result
   */
  autocomplete(event) {
    const { term } = this.highlightedResult()
    if (term && term !== this.props.term) {
      this.props.actions.updateItem(term)
      // fix mainInput placeholder
      const { results, selected } = this.props
      this.mainInputRef.current.onInput(event, results[selected].term)
      event.preventDefault()
    }
  }

  /**
   * Select highlighted element
   */
  selectCurrent(event) {
    this.selectItem(this.highlightedResult(), event)
  }

  /**
   * Render autocomplete suggestion from selected term
   */
  autocompleteValue() {
    const selected = this.highlightedResult()
    let term = ''
    if (selected && selected.term) {
      const regexp = new RegExp(`^${escapeStringRegexp(this.props.term)}`, 'i')
      if (selected.term.match(regexp)) {
        term = selected.term.replace(regexp, this.props.term)
        this.focusMainInput()
      }
    }
    return term
  }

  render() {
    const { isUpx, mainInputFocused, dragEnterStyle } = this.state

    return (
      <div className={styles.search}>
        <div ref={this.inputWrapperRef} className={styles.inputWrapper} style={dragEnterStyle}>
          {isUpx ? (
            <IUtools term={this.props.term} feature={this.props.results[0]} selected={this.props.selected} />
          ) : (
            <MainInput
              term={this.props.term}
              ref={this.mainInputRef}
              autoHolder={this.autocompleteValue()}
              onChange={this.props.actions.updateItem}
              onKeyDown={this.onKeyDown}
              onFocus={this.onMainInputFocus}
              onBlur={this.onMainInputBlur}
            />
          )}
        </div>
        {!isUpx && (
          <ResultsList
            results={this.props.results}
            selected={this.props.selected}
            visibleResults={this.props.visibleResults}
            onItemHover={this.props.actions.selectElement}
            onSelect={this.selectItem}
            mainInputFocused={mainInputFocused}
          />
        )}
        {isUpx && <StatusBar value={this.props.term} />}
        {this.props.statusBarText && <StatusBar value={this.props.statusBarText} />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    selected: state.search.selected,
    results: state.search.resultIds.map((id) => state.search.resultsById[id]),
    term: state.search.term,
    statusBarText: state.statusBar.text,
    prevTerm: state.search.prevTerm,
    visibleResults: state.search.visibleResults
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(searchActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cerebro)
