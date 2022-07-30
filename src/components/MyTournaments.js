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


class MyTournaments extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
        this.state = { selected: 0, brackets: [], bracketSelected: {}, isLoading: true, user: {} };
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
                this.fetchBrackets(newState);
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

    fetchBrackets = (passedState) => {
        console.log("MyTournaments.fetchBrackets");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}my-tournaments?email=${passedState.user.email}`,
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
                if (Array.isArray(responseData.brackets)) {
                    // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
                    this.setState({
                        brackets: responseData.brackets.map((bracket, index) => {
                            return { id: index, ...bracket };
                        })
                    });

                    function setStateBracket(state, props) {
                        const newState = { ...state, bracketSelected: state.brackets[0] };
                        return newState;
                    }
                    this.setState(setStateBracket);
                    console.log(this.state.bracketSelected);

                    function setLoading(state, props) {
                        const newState = { ...state, isLoading: false };
                        return newState;
                    }
                    this.setState(setLoading);
                    console.log(this.state.isLoading);

                } else {
                    toast.error("Fetch failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => {
                toast.error("Fetch failed.", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(err);
            })
    }

    onRadioClick = (event) => {
        console.log("MyTournaments.onRadioClick " + event.target.value);
        this.setState({ selected: event.target.value });
        function setStateBracket(state, props) {
            const newState = { ...state, bracketSelected: state.brackets[event.target.value] };
            return newState;
        }
        this.setState(setStateBracket);
        console.log(this.state.bracketSelected);

        this.setState({ selected: event.target.value });
    }

    render() {
        const columns = [
            {
                field: 'subtournamentid',
                headerName: 'Subtournament Id',
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
            { field: 'bracket_pos', headerName: 'Bracket Position', width: 300 }
        ];

        // if the fetch call returns brackets
        if (!this.state.isLoading && this.state.brackets.length !== 0) {
            return (
                <div className="App">
                    <h1>My Tournaments</h1>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={this.state.brackets} columns={columns} />
                        <Button id="competition" component={Link} to={{ pathname: `/competition/${this.state.bracketSelected.id}` }}
                            variant="outlined" color="primary" style={{ margin: 10 }}>
                            Go To Competition
                        </Button>
                    </div>
                    <ToastContainer autoClose={1500} />
                </div>
            )

        }
        // else if the fetch call returns an empty list
        else if (!this.state.isLoading) {
            return (
                <div className="App">
                    <div style={{ height: 400, width: '100%' }}>
                        <h1>You are not enrolled in any tournaments</h1>
                    </div>
                    <ToastContainer autoClose={1500} />
                </div>
            )
        }
        // else, waiting for the fetch - loading
        else {
            return (
                <div className="App">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <ReactLoading type="bubbles" color="#6c757d"
                            height={100} width={50} />
                    </div>
                    <ToastContainer autoClose={1500} />
                </div>
            )
        }
    }
}

export default MyTournaments;