import React, { createClass, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import series from './utils/series';
import whilst from './utils/whilst';
import throttle from './utils/throttle';
import { innerWidth, innerHeight } from './utils/innerSize';

function assertElementFitsWidth(el, width) {
    return el.scrollWidth <= width;
}

function assertElementFitsHeight(el, height) {
    return el.scrollHeight <= height;
}

export default createClass({

    displayName: 'Textfit',

    propTypes: {
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        text: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        mode: PropTypes.oneOf([
            'single', 'multi'
        ]),
        throttle: PropTypes.number
    },

    getDefaultProps() {
        return {
            min: 1,
            max: 100,
            mode: 'multi',
            throttle: 16
        };
    },

    getInitialState() {
        return {
            ready: false
        };
    },

    componentWillMount() {
        this.handleWindowResize = throttle(this.handleWindowResize, this.props.throttle);
    },

    componentDidMount() {
        this.mounted = true;
        this.process();
        window.addEventListener('resize', this.handleWindowResize);
    },

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('resize', this.handleWindowResize);
    },

    handleWindowResize() {
        const { ready } = this.state;
        if (!ready) return;
        this.setState({ ready: false }, () => this.process());
    },

    process(callback) {
        const { min, max, mode } = this.props;
        const el = findDOMNode(this);
        const { wrapper } = this.refs;

        const originalWidth = innerWidth(el);
        const originalHeight = innerHeight(el);

        const ready = fontSize => {
            if (!this.mounted) return;
            this.setState({ ready: true, fontSize }, () => callback && callback(fontSize));
        };

        const test = mode === 'multi'
            ? () => assertElementFitsHeight(wrapper, originalHeight)
            : () => assertElementFitsWidth(wrapper, originalWidth);

        const testOverflow = mode === 'multi'
            ? () => !assertElementFitsHeight(wrapper, originalHeight)
            : () => !assertElementFitsWidth(wrapper, originalWidth);

        // Step 1:
        // Binary search to fit the element's height (multi line) / width (single line)
        let mid;
        let low = min;
        let high = max;

        whilst(
            () => this.mounted && low <= high,
            stepCallback => {
                mid = parseInt((low + high) / 2, 10);
                this.setState({ fontSize: mid }, () => {
                    if (test()) low = mid + 1;
                    else high = mid - 1;
                    stepCallback();
                });
            },
            () =>
                // Step 2:
                // Sometimes the text still does not fit perfectly the element's bounds.
                // Therefore we decrease the font size until it fits.
                // This will only take a few iterations, so it's fine here.
                whilst(
                    () => this.mounted && testOverflow(),
                    stepCallback => this.setState({ fontSize: --mid }, stepCallback),
                    () => ready(mid)
                )
        );
    },

    render() {
        const { children, text, style, min, max, mode, ...props } = this.props;
        const { ready, fontSize } = this.state;
        const finalStyle = {
            ...style,
            fontSize: fontSize
        };

        const wrapperStyle = {};
        if (!ready) wrapperStyle.display = 'inline-block';
        if (mode === 'single') wrapperStyle.whiteSpace = 'nowrap';

        return (
            <div style={finalStyle} {...props}>
                <span ref="wrapper" style={wrapperStyle}>
                    {!!text && typeof children === 'function'
                        ? children(text)
                        : children
                    }
                </span>
            </div>
        );
    }
});
