import React, { Component } from 'react'

import Textfit from './components/TextFit'

export default class App extends Component {
  state = {
    text: 'Edit this text!',
    isSingleLine: false,
    min: 13,
    max: 100,
  }

  handleChangeText = (e) => {
    this.setState({ text: e.target.value })
  }

  handleChangeMode = (e) => {
    this.setState({ isSingleLine: e.target.value === 'single' })
  }

  handleChangeMin = (e) => {
    this.setState({ min: parseFloat(e.target.value) })
  }

  handleChangeMax = (e) => {
    let value = e.target.value

    if (e.target.value === '') {
      value = false
    } else {
      value = parseFloat(value)
    }

    this.setState({ max: value })
  }

  render() {
    const { text, isSingleLine } = this.state

    const inlineStyle = {
      height: 400,
    }

    return (
      <div>
        <h1 className="headline">
          react-textfit
          <a
            href="https://github.com/malte-wessel/react-textfit"
            target="_blank"
            style={{ float: 'right' }}
          >
            <i className="fa fa-github" />
          </a>
        </h1>
        <div className="row">
          <div className="column-100">
            <ul>
              <li>
                fit <strong>headlines and paragraphs</strong> into any element
              </li>
              <li>
                <strong>fast:</strong>
                {' '}
                uses binary search for efficiently find the correct fit
              </li>
              <li><strong>100%</strong> react-goodness</li>
              <li>
                works with
                {' '}
                <strong>any style</strong>
                {' '}
                configuration (line-height, padding, ...)
              </li>
            </ul>
          </div>
        </div>
        <h2 className="headline">Examples</h2>
        <div className="row">
          <div className="column-100">
            <Textfit isSingleLine max={500} className="box box-fat">
              <div style={{ fontSize: '26px' }}>
                Fat headlines!
              </div>
            </Textfit>
          </div>
        </div>
        <div className="row">
          <div className="column-25">
            <Textfit style={inlineStyle}>
              Multi line paragraphs at all sizes!
            </Textfit>
          </div>
          <div className="column-25">
            <Textfit style={inlineStyle}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </Textfit>
          </div>
          <div className="column-25">
            <Textfit style={inlineStyle}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </Textfit>
          </div>
          <div className="column-25">
            <Textfit style={inlineStyle}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </Textfit>
          </div>
        </div>
        <h2 className="headline">Playground</h2>
        <div className="row">
          <div className="column-50">
            <Textfit
              isSingleLine={isSingleLine}
              style={inlineStyle}
              min={this.state.min}
              max={this.state.max ? this.state.max : null}
              className="box box-fat"
            >
              {text}
            </Textfit>
          </div>
          <div className="column-50 playground">
            <textarea rows="8" value={text} onChange={this.handleChangeText} />
            <div className="row">
              <div className="column-50"><strong>Mode</strong></div>
              <div className="column-50">
                <select value={isSingleLine} onChange={this.handleChangeMode}>
                  <option value="multi">Multi line</option>
                  <option value="single">Single line</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="column-50">
                <strong>Minimum Size</strong>
              </div>
              <div className="column-50">
                <label>
                  <input
                    type="text"
                    value={this.state.min}
                    onChange={this.handleChangeMin}
                  />
                </label>
              </div>
            </div>
            <div className="row">
              <div className="column-50">
                <strong>Maximum Size</strong>
              </div>
              <div className="column-50">
                <label>
                  <input
                    type="text"
                    value={this.state.max}
                    onChange={this.handleChangeMax}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
