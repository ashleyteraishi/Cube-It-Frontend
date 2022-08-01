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


class StarterCompetition extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("props.cubetype", props.match.params.cubetype)
        console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
        this.state = { user: {}, entryTimes: [], average: null, bracketid: null};
    }

    componentDidMount() {
        this.getBracketId();
        this.getUser();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.entryTimes !== this.state.entryTimes) {
            this.fetchTimes(this.state);
            if (this.state.entryTimes.length >=20) {
                this.fetchAverage();
            }
        }
    }

    handleClick = () => {
        this.fetchTimes(this.state);
            if (this.state.entryTimes.length >=20) {
                this.fetchAverage();
            }
    }

    getBracketId = () => {
        function setStateBracketId(state, props) {
            const cubetypes = ["2x2", "3x3", "4x4", "5x5", "6x6", "7x7", "3x3blnf", "pyram", "megam", "skewb", "sqone", "clock"]; 
            const id = cubetypes.findIndex(type => type === props.match.params.cubetype) + 1;
            const newState = { ...state, bracketid: id };
            return newState;
        }
        this.setState(setStateBracketId);
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
                this.fetchUser(newState);
                this.fetchTimes(newState);
                return newState;
            }
            this.setState(setStateUser);
        }
    }

    fetchUser = (passedState) => {
        console.log("Subtournament.fetchUser");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}user?email=${passedState.user.email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then(res => {
                if (res.ok) {
                    toast.success("Time successfully added", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                } else {
                    toast.error("Error when adding", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                    console.error('Post http status =' + res.status);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    fetchTimes = (passedState) => {
        const token = Cookies.get('XSRF-TOKEN');
        console.log("start competition fetchTimes");

        fetch(`${SERVER_URL}entry-times?bracketid=${passedState.bracketid}&email=${passedState.user.email}`,
            {
                method: 'GET',
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

    fetchAverage = () => {
        console.log("fetchAverage");
        const token = Cookies.get('XSRF-TOKEN');

        fetch(`${SERVER_URL}user-record?cubetype=${this.props.match.params.cubetype}&email=${this.state.user.email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'Access-Control-Allow-Origin': '*'
                },
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.average) {
                    function setStateAverage(state, props) {
                        const newState = { ...state, average: responseData.average };
                        return newState;
                    }
                    this.setState(setStateAverage);
                } else {
                    toast.error("User record fetch failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => { console.error(err); })
    }

    render() {
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
                    <h1>Starter Tournament</h1>
                    <h2>{this.state.user.name}</h2>
                    <h2>{this.props.match.params.cubetype}</h2>
                    <p>Complete 20 solves in order to save your initial lifetime average.</p>
                    <p>Once you have a lifetime average, you can begin competiting for that cube type!</p>
                </div>
                {this.state.entryTimes.length < 20 &&
                    <div>
                        <h3>Input Time</h3>
                        <StopWatch bracketid={this.state.bracketid} />
                    </div>
                }
                {this.state.entryTimes.length >= 20 &&
                    <div>
                        <h3>Your new lifetime average is:</h3>
                        <h2>{this.state.average}</h2>
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
        )
    }
}

export default StarterCompetition;