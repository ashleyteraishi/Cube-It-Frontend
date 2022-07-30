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

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class StarterCompetition extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("props.cubetype", props.match.params.cubetype)
        console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
        this.state = { user: {}, time: null, entryTimes: [], average: null};

        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.fetchTimes();
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
                    this.fetchTimes();
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

        fetch(`${SERVER_URL}starter-competition?cubetype=${this.props.match.params.cubetype}&email=${this.state.user.email}&time=${parseFloat(this.state.time)}`,
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
                    if (this.state.entryTimes.length >= 20) {
                        this.fetchAverage();
                    }
                } else {
                    toast.error("Post failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => { console.error(err); })
    }

    fetchTimes = () => {
        const token = Cookies.get('XSRF-TOKEN');

        fetch(`${SERVER_URL}entry-times?cubetype=${this.props.match.params.cubetype}&email=${this.state.user.email}`,
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
                        <h3>Input Time (Temporary)</h3>
                        <label>
                            Time:
                            <input type="number" step="0.01" id="inputTime" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <Button id="AddTime" onClick={this.addTime}
                            variant="outlined" color="primary" >
                            Submit
                        </Button>

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