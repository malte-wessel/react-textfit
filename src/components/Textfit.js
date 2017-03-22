import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import shallowEqual from './utils/shallowEqual'
import series from './utils/series'
import whilst from './utils/whilst'
import throttle from './utils/throttle'
import uniqueId from './utils/uniqueId'
import { innerWidth, innerHeight } from './utils/innerSize'

function assertElementFitsWidth(el, width) {
  // -1: temporary bugfix, will be refactored soon
  return el.scrollWidth - 1 <= width
}

function assertElementFitsHeight(el, height) {
  // -1: temporary bugfix, will be refactored soon
  return el.scrollHeight - 1 <= height
}

export default class Textfit extends Component {
  static propTypes = {
    /**
     * The text of children will be resized to fit
     */
    children: PropTypes.node,
    /**
     * Minimum Size the text can ever be. Single line mode will shown an ellipsis
     * if text is still longer than its container
     */
    min: PropTypes.number,
    /**
     * Maximum size the text can ever be.
     */
    max: PropTypes.number,
    /**
     * are we dealing with only a single line of text?
     */
    isSingleLine: PropTypes.bool,
    /**
     * a function to be called when the sizing is done. The final size value will be provided.
     */
    onReady: PropTypes.func,
  }

  static defaultProps = {
    min: 13,
    isSingleLine: false,
  }

  state = {
    fontSize: null,
    ready: false,
    shouldScroll: false,
  }

  componentWillMount = () => {
    this.handleWindowResize = throttle(this.handleWindowResize, 50)
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleWindowResize)

    this.process()
  }

  componentDidUpdate = (prevProps) => {
    if (!this.state.ready) return
    if (shallowEqual(this.props, prevProps)) return

    this.process()
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleWindowResize)

    // Setting a new pid will cancel all running processes
    this.pid = uniqueId()
  }

  handleWindowResize = () => {
    this.process()
  }

  process = () => {
    const {
      min,
      isSingleLine,
      onReady,
    } = this.props

    const el = findDOMNode(this)
    const originalWidth = innerWidth(el)
    const originalHeight = innerHeight(el)

    // if we don't have a max value, use the full height of the container.
    const max = this.props.max ? this.props.max : originalHeight

    const wrapper = this._root

    if (originalHeight <= 0 || isNaN(originalHeight)) {
      console.warn(
        'Can not process element without height. Make sure the element is displayed and has a static height.',
      )
      return
    }

    if (originalWidth <= 0 || isNaN(originalWidth)) {
      console.warn(
        'Can not process element without width. Make sure the element is displayed and has a static width.',
      )
      return
    }

    const pid = uniqueId()
    this.pid = pid

    const shouldCancelProcess = () => pid !== this.pid

    const testPrimary = isSingleLine
      ? () => assertElementFitsWidth(wrapper, originalWidth)
      : () => assertElementFitsHeight(wrapper, originalHeight)

    const testSecondary = isSingleLine
      ? () => assertElementFitsHeight(wrapper, originalHeight)
      : () => assertElementFitsWidth(wrapper, originalWidth)

    let mid
    let low = min
    let high = max

    this.setState({ ready: false })

    series(
      [
        // Step 1:
        // Binary search to fit the element's height (multi line) / width (single line)
        stepCallback =>
          whilst(
            () => low <= high,
            (whilstCallback) => {
              if (shouldCancelProcess()) return whilstCallback(true)
              mid = parseInt((low + high) / 2, 10)
              this.setState({ fontSize: mid }, () => {
                if (shouldCancelProcess()) return whilstCallback(true)
                if (testPrimary()) low = mid + 1
                else high = mid - 1
                return whilstCallback()
              })
            },
            stepCallback,
          ),
        // Step 2:
        // Binary search to fit the element's width (multi line)
        // in order to not fit the elements height and decrease the width
        (stepCallback) => {
          if (testSecondary()) return stepCallback()
          low = min
          high = mid
          return whilst(
            () => low <= high,
            (whilstCallback) => {
              if (shouldCancelProcess()) return whilstCallback(true)
              mid = parseInt((low + high) / 2, 10)
              this.setState({ fontSize: mid }, () => {
                if (pid !== this.pid) return whilstCallback(true)
                if (testSecondary()) low = mid + 1
                else high = mid - 1
                return whilstCallback()
              })
            },
            stepCallback,
          )
        },
        // Step 3
        // Make sure fontSize is always greater than 0
        (stepCallback) => {
          if (mid > 0) return stepCallback()
          mid = 1
          this.setState({ fontSize: mid }, stepCallback)
        },
      ],
      (err) => {
        // err will be true, if another process was triggered
        if (err) return

        this.setState({
          ready: true,
          shouldScroll: innerHeight(wrapper) > originalHeight,
        })

        if (onReady) {
          onReady(mid)
        }
      },
    )
  }

  render() {
    const {
      children,
      text,
      style,
      min,
      max,
      isSingleLine,
      onReady,
      ...otherProps
    } = this.props

    const { fontSize, ready } = this.state

    const finalStyle = {
      ...style,
      fontSize: fontSize,
      overflowY: this.state.shouldScroll ? 'auto' : 'clip',
    }

    const wrapperStyle = {
      display: ready ? 'block' : 'inline-block',
      whiteSpace: isSingleLine ? 'nowrap' : 'normal',
      overflow: isSingleLine ? 'hidden' : 'visible',
      textOverflow: isSingleLine ? 'ellipsis' : 'clip',
    }

    return (
      <div style={finalStyle} {...otherProps}>
        <span
          ref={c => this._root = c}
          style={wrapperStyle}
          children={children}
        />
      </div>
    )
  }
}
