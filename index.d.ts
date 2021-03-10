import React from 'react';

interface TextfitProps {
    /**
     * Minimum value for interpolation
     * Default: 1
     */
    min?: number,
    /**
     * Maximum value for interpolation
     * Default 100
     */
    max?: number,
    /**
     *  (single|multi) Algorithm to fit the text. Use single for headlines and multi for paragraphs. 
     *  Default is multi.
     */
    mode?: "multi" | "single",
    /**
     * (Boolean) When mode is single and forceSingleModeWidth is true, the element's height will be ignored. 
     * Default is true.
     */
    forceSingleModeWidth?: boolean,
    /**
     * (Number) Window resize throttle in milliseconds. Default is 50.
     */
    throttle?: number,
    /**
     * Auto resize. Adds a listener to the window if true to detect changes.
     * Default: false
     */
    autoResize?: boolean,
    /**
     * (Function) Will be called when text is fitted.
     */
    onReady?:(finalFontSize: number )=>void,
    children?: React.ReactNode;
}

/**
 * Textfit
 * 
 * [github](https://github.com/malte-wessel/react-textfit/)
 * 
 * * fit **headlines and paragraphs** into any element
 * **fast:** uses binary search for efficiently find the correct fit
 * **100%** react-goodness
 * works with **any style** configuration (line-height, padding, ...)
 * **[check out the demo](http://malte-wessel.github.io/react-textfit/)**
 */
type Textfit = (props:TextfitProps) => JSX.Element

export {Textfit}
export default Textfit;