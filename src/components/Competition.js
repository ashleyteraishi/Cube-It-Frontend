import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';
import { Radio } from '@mui/material';
import Button from '@mui/material/Button';
import { Link, withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';
import StopWatch from './StopWatch.js';

class Competition extends React.Component {
    constructor(props) {
        super(props);
    }

    handleKeyDown = event => {
        if(event.key === " ") {
            console.log("Spacebar")
        }
    }

    render() {
        return(
            <div tabIndex={0} onKeyDown={this.handleKeyDown}>
                <h1>EXAMPLE TOURNAMENT</h1>
                <div>
                    <h1>VIDEO HERE</h1>
                </div>
                <div>
                    <h1>OPPONENT INFO</h1>
                </div>
                <div>
                    <h1>MY INFO</h1>
                </div>
                <div>
                    <h3>TIMER</h3>
                    <StopWatch />
                </div>
                <div>
                    <h1>Blank Space</h1>
                </div>
            </div>
        );
    };
}
export default Competition;