react-textfit
=========================

[![npm](https://img.shields.io/badge/npm-react--textfit-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/react-textfit.svg?style=flat-square)](https://www.npmjs.com/package/react-textfit)
[![npm downloads](https://img.shields.io/npm/dm/react-textfit.svg?style=flat-square)](https://www.npmjs.com/package/react-textfit)

* fit **headlines and paragraphs** into any element
* **fast:** uses binary search for efficiently find the correct fit
* **100%** react-goodness
* works with **any style** configuration (line-height, padding, ...)
* **[check out the demo](http://malte-wessel.github.io/react-textfit/)**

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Modes](#modes)
- [API](#api)
- [License](#license)

## Installation
```bash
npm install react-textfit --save
```

## Usage

### Headlines

```javascript
import { Textfit } from 'react-textfit';

class App extends Component {
  render() {
    return (
      <Textfit isSingleLine>
        Fat headline!
      </Textfit>
    );
  }
}
```

#### Set a minimum size and show an ellipsis if the text overflows its container

```javascript
import { Textfit } from 'react-textfit';

class App extends Component {
  render() {
    return (
      <Textfit
        isSingleLine
        min={13}>
        Fat headline!
      </Textfit>
    );
  }
}
```

### Paragraphs

```javascript
import { Textfit } from 'react-textfit';

class App extends Component {
  render() {
    return (
      <Textfit>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Textfit>
    );
  }
}
```

## Modes

### `single`

**Algorithm steps:**
```
1. binary search to fit the element's width
2. if text overflows height
    2a. binary search to also fit the elements height
3. if text still overflows width
    3a. decrease font size until text fits element's width

```

### `multi`

**Algorithm steps:**
```
1. binary search to fit the element's height
2. if text overflows width
    2a. binary search to also fit the elements width

```

## API

### `<Textfit>`

#### Props

* `isSingleLine` (Boolean) Use for headlines, text will not wrap
* `min` (Number) Minimum font size in pixel. Default is `13`.
* `max` (Number) Maximum font size in pixel. Default is the current height of the container.
* `onReady` (Function) Will be called when text is fitted.

## License

MIT
