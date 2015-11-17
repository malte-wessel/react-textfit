import React, { createClass } from 'react';
import { Textfit } from 'react-textfit';

export default createClass({

    displayName: 'App',

    render() {
        return (
            <div>
                <div className="row">
                    <div className="column">
                        <Textfit style={{ height: 300 }} className="box">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Textfit>
                    </div>
                    <div className="column">

                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <Textfit mode="single" className="box box-fat">
                            Lorem ipsum dolor sit amet
                        </Textfit>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <Textfit text="Lorem ipsum" max={500} style={{ height: 400 }} className="box box-fat">
                            {text => text}
                        </Textfit>
                    </div>
                </div>
            </div>
        );
    }
});
