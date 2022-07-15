import React from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import Zoom from './Zoom'

class Competition extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className='App'>
                <h1>Competition Page</h1>
                <Zoom/>
            </div>
        )

    }
}
export default Competition;