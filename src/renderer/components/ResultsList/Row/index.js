import React, { Component } from 'react'
import { SmartIcon } from 'cerebro-ui'
import styles from './styles.scss'

class Row extends Component {
  constructor(props) {
    super(props)
    this.rowRef = React.createRef()
  }

  componentDidMount() {}

  classNames() {
    return [styles.row, this.props.selected ? styles.selected : null].join(' ')
  }

  renderIcon() {
    const { icon } = this.props
    if (!icon) return null
    return <SmartIcon path={icon} className={styles.icon} />
  }

  render() {
    const { title, onSelect, onMouseMove, subtitle } = this.props
    return (
      <div className={this.classNames()} onClick={onSelect} onMouseMove={onMouseMove} ref={this.rowRef}>
        {this.renderIcon()}
        <div className={styles.details}>
          {title && <div className={styles.title}> {title} </div>}
          {subtitle && <div className={styles.subtitle}> {subtitle} </div>}
        </div>
      </div>
    )
  }
}

/* Row.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  onSelect: PropTypes.func,
  onMouseMove: PropTypes.func
} */

export default Row
