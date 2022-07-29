import React from 'react';
import { SERVER_URL } from '../constants.js'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { getSuggestedQuery } from '@testing-library/react';
import { DataGrid } from '@mui/x-data-grid';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {}, lifetimeAverages: [], cubetypes: [], userRecords: []};
    };

    componentDidMount() {
        this.getUser();
        this.fetchCubeTypes();
    }

    getUser() {
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
                this.fetchLifetimeAverages(newState);
                return newState;
            }
            this.setState(setStateUser);
        }
    }

    fetchCubeTypes() {
        console.log("Account.fetchCubeTypes");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}cubetypes`,
            {
                method: 'GET',
                headers: { 'X-XSRF-TOKEN': token },
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (Array.isArray(responseData.CUBETYPES)) {
                    //  add to each cubetype an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
                    this.setState({ cubetypes: responseData.CUBETYPES.map((cubetype, index) => ({ id: index, ...cubetype})) });
                }
            })
            .catch(err => console.error(err));
    }

    fetchLifetimeAverages(loggedState) {
        console.log("Account.fetchLifetimeAverages");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}alluserrecord?email=${loggedState.user.email}`,
            {
                method: 'GET',
                headers: { 'X-XSRF-TOKEN': token },
            })
            .then((response) => response.json())
            .then((responseData) => {
                if (Array.isArray(responseData.userRecords)) {
                    //  add to each record an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
                    this.setState({ lifetimeAverages: responseData.userRecords.map((record, index) => ({ id: index, ...record })) });
                } else {
                    console.log("else block");
                    function setStateLifetimeAverages(state, props) {
                        const newState = { ...state, lifetimeAverages: [] };
                        return newState;
                    }
                    this.setState(setStateLifetimeAverages);
                }
            })
            .catch(err => console.error(err));
    }

    mapCubeToAverage() {
        const result = [];
        console.log("cubetypes: " ,this.state.cubetypes);
        this.state.cubetypes.forEach(cubetype => {
            result.push({type: cubetype, average: "No Lifetime Average"})
        })
        console.log(result)
    }

    render() {
        const columns = [
            {
                field: 'cubeType',
                headerName: 'Cube Type',
                width: 400,
                renderCell: (params) => (
                    <div>
                        {params.value}
                    </div>
                )
            },
            { field: 'average', headerName: 'Lifetime Average', width: 300 }
        ];

        if (this.state.user !== {}) {
            return (
                <div className='App'>
                    <h1>Account</h1>
                    <h2>{this.state.user.name}</h2>
                    <div>
                        <h2>Lifetime Averages</h2>
                        {this.state.lifetimeAverages !== [] &&
                            <div style={{ height: 450, width: '100%', align: "left" }}>
                                <DataGrid rows={this.state.lifetimeAverages} columns={columns} />
                            </div>
                        }

                        {this.state.lifetimeAverages.length < 12 &&
                                <Button id="StarterTournament" component={Link} to={{ pathname: `/competition` }}
                                    variant="outlined" color="primary" style={{ margin: 10 }}>
                                    Get Lifetime Average
                                </Button>
                        }
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className='App'>
                    <h1>Login to view your account</h1>
                </div>
            );
        }
    }
}


export default Account;