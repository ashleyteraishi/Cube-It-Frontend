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
        this.state = { user: {}, entryTimes: [], bracketAverage: null };
    }

    componentDidMount() {
        this.getUser();
        this.fetchTimes();
        if (this.state.entryTimes.length >= 5) {
            this.fetchBracketAverage();
        }
    }

    componentDidUpdate() {
        if (this.state.entryTimes.length < 5) {
            this.fetchTimes();
        }
        else {
            this.fetchBracketAverage();
        }
    }

    fetchTimes = () => {
        console.log("Subtournament.fetchTimes");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}competition/times?bracketid=${this.props.match.params.bracketid}&email=${this.state.user.email}`,
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
                return newState;
            }
            this.setState(setStateUser);
        }
    }

    /*
    handleChange(event) {
        console.log("handle change time:", event.target.value)
        function setStateTime(state, props) {
            const newState = { ...state, time: event.target.value };
            return newState;
        }
        this.setState(setStateTime);
    }

    addTime = () => {
        const token = Cookies.get('XSRF-TOKEN');

        fetch(`${SERVER_URL}competition?bracketid=${this.props.match.params.bracketid}&email=${this.state.user.email}&time=${parseFloat(this.state.time)}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                },
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (Array.isArray(responseData.entryTimes)) {
                    //  add to each entryTime an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
                    this.setState({ entryTimes: responseData.entryTimes.map((entryTime, index) => ({ id: index, ...entryTime })) });
                } else {
                    toast.error("Post failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => { console.error(err); })
    }
    */

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
                    {this.state.entryTimes.length >= 5 && this.state.bracketAverage &&
                        <div>
                            <h3>Bracket Average:</h3>
                            <h2>{this.state.bracketAverage}</h2>
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