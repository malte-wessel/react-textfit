import React, { createClass } from 'react';
import { Textfit } from 'react-textfit';

export default createClass({

    displayName: 'App',

    render() {
        return (
            <div>
                <Textfit style={{ height: 100, background: '#eee', border: '1px solid red'}}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Textfit>
                <Textfit mode="single" style={{ background: '#eee', border: '1px solid red'}}>
                    Lorem ipsum dolor sit amet
                </Textfit>
                <Textfit text="Lorem ipsum" max={500} style={{ height: 400, background: '#eee', border: '1px solid red'}}>
                    {text => text}
                </Textfit>
            </div>
        );
    }
});
