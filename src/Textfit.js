import React from 'react';
import PropTypes from 'prop-types';
import shallowEqual from './utils/shallowEqual';
import series from './utils/series';
import whilst from './utils/whilst';
import throttle from './utils/throttle';
import uniqueId from './utils/uniqueId';
import { innerWidth, innerHeight } from './utils/innerSize';

function assertElementFitsWidth(el, width) {
    // -1: temporary bugfix, will be refactored soon
    return el.scrollWidth - 1 <= width;
}

function assertElementFitsHeight(el, height) {
    // -1: temporary bugfix, will be refactored soon
    return el.scrollHeight - 1 <= height;
}

function noop() {}

export default class TextFit extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        text: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        mode: PropTypes.oneOf([
            'single', 'multi'
        ]),
        forceSingleModeWidth: PropTypes.bool,
        throttle: PropTypes.number,
        onReady: PropTypes.func
    }

    static defaultProps = {
        min: 1,
        max: 100,
        mode: 'multi',
        forceSingleModeWidth: true,
        throttle: 50,
        autoResize: true,
        onReady: noop
    }

    constructor(props) {
        super(props);
        if ('perfectFit' in props) {
            console.warn('TextFit property perfectFit has been removed.');
        }

        this.handleWindowResize = throttle(this.handleWindowResize, props.throttle);
    }

    state = {
        fontSize: null,
        ready: false
    }

    componentDidMount() {
        const { autoResize } = this.props;
        if (autoResize) {
            window.addEventListener('resize', this.handleWindowResize);
        }
        this.process();
    }

    componentDidUpdate(prevProps) {
        const { ready } = this.state;
        if (!ready) return;
        if (shallowEqual(this.props, prevProps)) return;
        this.process();
    }

    componentWillUnmount() {
        const { autoResize } = this.props;
        if (autoResize) {
            window.removeEventListener('resize', this.handleWindowResize);
        }
        // Setting a new pid will cancel all running processes
        this.pid = uniqueId();
    }

    handleWindowResize = () => {
        this.process();
    }

    process() {
        const { min, max, mode, forceSingleModeWidth, onReady } = this.props;
        const el = this._parent;
        const wrapper = this._child;

        const originalWidth = innerWidth(el);
        const originalHeight = innerHeight(el);

        if (originalHeight <= 0 || isNaN(originalHeight)) {
            console.warn('Can not process element without height. Make sure the element is displayed and has a static height.');
            return;
        }

        if (originalWidth <= 0 || isNaN(originalWidth)) {
            console.warn('Can not process element without width. Make sure the element is displayed and has a static width.');
            return;
        }

        const pid = uniqueId();
        this.pid = pid;

        const shouldCancelProcess = () => pid !== this.pid;

        const testPrimary = mode === 'multi'
            ? () => assertElementFitsHeight(wrapper, originalHeight)
            : () => assertElementFitsWidth(wrapper, originalWidth);

        const testSecondary = mode === 'multi'
            ? () => assertElementFitsWidth(wrapper, originalWidth)
            : () => assertElementFitsHeight(wrapper, originalHeight);

        let mid;
        let low = min;
        let high = max;

        this.setState({ ready: false});

        series([
            // Step 1:
            // Binary search to fit the element's height (multi line) / width (single line)
            stepCallback => whilst(
                () => low <= high,
                whilstCallback => {
                    if (shouldCancelProcess()) return whilstCallback(true);
                    mid = parseInt((low + high) / 2, 10);
                    this.setState({ fontSize: mid }, () => {
                        if (shouldCancelProcess()) return whilstCallback(true);
                        if (testPrimary()) low = mid + 1;
                        else high = mid - 1;
                        return whilstCallback();
                    });
                },
                stepCallback
            ),
            // Step 2:
            // Binary search to fit the element's width (multi line) / height (single line)
            // If mode is single and forceSingleModeWidth is true, skip this step
            // in order to not fit the elements height and decrease the width
            stepCallback => {
                if (mode === 'single' && forceSingleModeWidth) return stepCallback();
                if (testSecondary()) return stepCallback();
                low = min;
                high = mid;
                return whilst(
                    () => low < high,
                    whilstCallback => {
                        if (shouldCancelProcess()) return whilstCallback(true);
                        mid = parseInt((low + high) / 2, 10);
                        this.setState({ fontSize: mid }, () => {
                            if (pid !== this.pid) return whilstCallback(true);
                            if (testSecondary()) low = mid + 1;
                            else high = mid - 1;
                            return whilstCallback();
                        });
                    },
                    stepCallback
                );
            },
            // Step 3
            // Limits
            stepCallback => {
                // We break the previous loop without updating mid for the final time,
                // so we do it here:
                mid = Math.min(low, high);

                // Ensure we hit the user-supplied limits
                mid = Math.max(mid, min);
                mid = Math.min(mid, max);

                // Sanity check:
                mid = Math.max(mid, 0);

                if (shouldCancelProcess()) return stepCallback(true);
                this.setState({ fontSize: mid }, stepCallback);
            }
        ], err => {
            // err will be true, if another process was triggered
            if (err || shouldCancelProcess()) return;
            this.setState({ ready: true }, () => onReady(mid));
        });
    }

    render() {
        const {
            children,
            text,
            style,
            min,
            max,
            mode,
            forceWidth,
            forceSingleModeWidth,
            /* eslint-disable no-shadow */
            throttle,
            /* eslint-enable no-shadow */
            autoResize,
            onReady,
            ...props
        } = this.props;
        const { fontSize, ready } = this.state;
        const finalStyle = {
            ...style,
            fontSize: fontSize
        };

        const wrapperStyle = {
            display: ready ? 'block' : 'inline-block'
        };
        if (mode === 'single') wrapperStyle.whiteSpace = 'nowrap';

        return (
            <div ref={c => this._parent = c} style={finalStyle} {...props}>
                <div ref={c => this._child = c} style={wrapperStyle}>
                    {text && typeof children === 'function'
                        ? ready
                            ? children(text)
                            : text
                        : children
                    }
                </div>
            </div>
        );
    }
}
