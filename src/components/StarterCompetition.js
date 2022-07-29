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
import AddSubtournament from './AddSubtournament.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class StarterCompetition extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("props.cubetype", props.match.params.cubetype)
        console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
        this.state = { user: {} };
    }

    componentDidMount() {
        this.getUser();
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
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData) {
                    function setStateUser(state, props) {
                        const newState = { ...state, user: responseData };
                        return newState;
                    }
                    this.setState(setStateUser);

                    function setLoading(state, props) {
                        const newState = { ...state, isLoading: false };
                        return newState;
                    }
                    this.setState(setLoading);
                    console.log(this.state.isLoading);

                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    render() {
        const columns = [
            {
                field: 'subtournamentType',
                headerName: 'Type',
                width: 400,
                renderCell: (params) => (
                    <div>
                        <Radio
                            checked={params.row.id == this.state.selected}
                            onChange={this.onRadioClick}
                            value={params.row.id}
                            color="default"
                            size="small"
                        />
                        {params.value}
                    </div>
                )
            },
        ];

        return (
            <div className='App'>
                <h1>Starter Tournament</h1>
                <h2>{this.state.user.name}</h2>
                <h2>{this.props.match.params.cubetype}</h2>
                <p>Complete 20 solves in order to save your initial lifetime average.</p>
                <p>Once you have a lifetime average, you can begin competiting for that cube type!</p>
            </div>
        )
    }
}

export default StarterCompetition;