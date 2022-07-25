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

function CurrentUserInfo(props) {
    return (
        <div>
            <h1>My Info</h1>
            <h3>Current User</h3>
            <StopWatch />
        </div>
    );
}

function OpponentInfo(props) {
    return (
        <div>
            <h1>Opponent Info</h1>
            <h3>Name</h3>
        </div>
    );
}

function BracketScreen(props) {
    return(
        <div>
            <h1>Bracket</h1>
        </div>
    );
}

class Competition extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <div>
                    <CurrentUserInfo />
                </div>
                <div>
                    <BracketScreen />
                    <OpponentInfo />
                </div>
            </div>
        );
    };
}
export default Competition;

// class Competition extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return(
//             <div>
//                 <h1>MATCH</h1>
//                 <div>
//                     <h1>VIDEO HERE</h1>
//                 </div>
//                 <div>
//                     <h1>OPPONENT INFO</h1>
//                 </div>
//                 <div>
//                     <h1>MY INFO</h1>
//                 </div>
//                 <div>
//                     <h3>TIMER</h3>
//                     <StopWatch />
//                 </div>
//                 <div>
//                     <h1>Blank Space</h1>
//                 </div>
//             </div>
//         );
//     };
// }
// export default Competition;



/*function Dialog(props) {
    return (
      <FancyBorder color="blue">
        <h1 className="Dialog-title">
          {props.title}
        </h1>
        <p className="Dialog-message">
          {props.message}
        </p>
        {props.children}
      </FancyBorder>
    );
  }
  
  class SignUpDialog extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleSignUp = this.handleSignUp.bind(this);
      this.state = {login: ''};
    }
  
    render() {
      return (
        <Dialog title="Mars Exploration Program"
                message="How should we refer to you?">
          <input value={this.state.login}
                 onChange={this.handleChange} />
          <button onClick={this.handleSignUp}>
            Sign Me Up!
          </button>
        </Dialog>
      );
    }
  
    handleChange(e) {
      this.setState({login: e.target.value});
    }
  
    handleSignUp() {
      alert(`Welcome aboard, ${this.state.login}!`);
    }
  }*/