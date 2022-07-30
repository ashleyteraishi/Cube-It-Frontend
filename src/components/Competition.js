import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Cookies from 'js-cookie';
import { SERVER_URL } from '../constants.js';
import ReactLoading from 'react-loading';
import jwt_decode from 'jwt-decode';
import StopWatch from './StopWatch.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Competition extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("props.bracketid", props.match.params.bracketid)
        console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
        this.state = { user: {}, entryTimes: [], bracketAverage: null, lifetimeAverage: null};
    }

    componentDidMount() {
        this.getUser();
        if (this.state.entryTimes.length >= 5) {
            this.fetchBracketAverage();
        }
    }

    componentDidUpdate() {
        this.fetchTimes(this.state);
        if (this.state.entryTimes.length >=5 ) {
            this.fetchBracketAverage();
        }
    }

    fetchTimes = (passedState) => {
        console.log("Subtournament.fetchTimes");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}entry-times?bracketid=${this.props.match.params.bracketid}&email=${passedState.user.email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (Array.isArray(responseData.entryTimes)) {
                    //  add to each entryTimes an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
                    this.setState({ entryTimes: responseData.entryTimes.map((entryTime, index) => ({ id: index, ...entryTime })) });
                } else {
                    console.log("no times yet");
                }
            })
            .catch(err => console.error(err));

    }

    fetchBracketAverage = () => {
        console.log("Subtournament.fetchBracketAverage");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}competition/bracket-average/?bracketid=${this.props.match.params.bracketid}&email=${this.state.user.email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData) {
                    this.setState({ bracketAverage: responseData });
                    function setStateBracketAverage(state, props) {
                        const newState = { ...state, bracketAverage: responseData};
                        this.fetchLifetimeAverage();
                        return newState;
                    }
                    this.setState(setStateBracketAverage);
                } else {
                    toast.error("Bracket average fetch failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => console.error(err));
    }

    fetchLifetimeAverage = () => {
        console.log("Subtournament.fetchLifetimeAverage");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}updateAverage?email=${this.state.user.email}&bracketid=${this.props.match.params.bracketid}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData) {
                    function setStateLifetimeAverage(state, props) {
                        const newState = { ...state, lifetimeAverage: responseData};
                        return newState;
                    }
                    this.setState(setStateLifetimeAverage);
                } else {
                    toast.error("Lifetime average fetch failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => console.error(err));
    }

    getUser = () => {
        if (localStorage.getItem('jwt') === null) {
            function setStateUser(state, props) {
                const newState = { ...state, user: {} };
                return newState;
            }
            this.setState(setStateUser);
        }
        else {
            const storedJwt = localStorage.getItem('jwt');
            console.log("account jwt:", jwt_decode(storedJwt));
            function setStateUser(state, props) {
                const newState = { ...state, user: jwt_decode(storedJwt) };
                this.fetchTimes(newState);
                return newState;
            }
            this.setState(setStateUser);
        }
    }

    render() {
        console.log("bracket average:", this.state.bracketAverage)

        const columns = [
            {
                field: 'time',
                headerName: 'Time',
                width: 400,
                renderCell: (params) => (
                    <div>
                        {params.value}
                    </div>
                )
            },
        ];

        return (
            <div className='App'>
                <div>
                    <h1>Competition Page</h1>
                    <h2>{this.state.user.name}</h2>
                    <h2>{this.props.match.params.bracketid}</h2>
                </div>
                <div>
                    {this.state.entryTimes.length >= 5 && this.state.bracketAverage && this.state.lifetimeAverage &&
                        <div>
                            <h3>Bracket Average:</h3>
                            <h2>{this.state.bracketAverage}</h2>
                            <h3>New Lifetime Average:</h3>
                            <h2>{this.state.lifetimeAverage}</h2>
                        </div>
                    }
                    {this.state.entryTimes.length < 5 &&
                        <div>
                            <h3>Input Time</h3>
                            <StopWatch bracketid={this.props.match.params.bracketid} />
                        </div>
                    }
                    {this.state.entryTimes !== [] &&
                        <div>
                            <h3>Submitted Times</h3>
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid rows={this.state.entryTimes} columns={columns} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Competition;