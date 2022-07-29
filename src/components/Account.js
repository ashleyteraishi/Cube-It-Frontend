import React from 'react';
import { SERVER_URL } from '../constants.js'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { getSuggestedQuery } from '@testing-library/react';
import { DataGrid } from '@mui/x-data-grid';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import { ListItemSecondaryAction } from '@mui/material';
import Radio from '@mui/material/Radio';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: 1, selectedUserRecord: {}, user: {}, cubetypes: [], userRecords: [] };
    };

    componentDidMount() {
        this.fetchCubeTypes();
        this.getUser();
    }

    onRadioClick = (event) => {
        console.log("Account.onRadioClick " + event.target.value);

        function setStateSelectedRecord(state, props) {
            const newState = { ...state, selectedUserRecord: state.userRecords[event.target.value - 1] };
            return newState;
          }
          this.setState(setStateSelectedRecord);
          console.log("onRadioClick selectedUserRecord", this.state.selectedUserRecord);

        this.setState({ selected: event.target.value});
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
                if (Array.isArray(responseData)) {
                    function setStateCubeTypes(state, props) {
                        const newState = { ...state, cubetypes: responseData };
                        this.mapCubeTypes(newState);
                        return newState;
                    }
                    this.setState(setStateCubeTypes);
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
                    console.log("responseData.userRecords: ", responseData.userRecords)
                    responseData.userRecords.map(obj => {
                        let index = this.state.userRecords.findIndex(o => o.cubetype === obj.cubeType);
                        console.log("found index:", index)
                        function setStateUserRecords(state, props) {
                            const newState = {
                                ...state, userRecords: [
                                    ...state.userRecords.slice(0, index),
                                    {
                                        ...state.userRecords[index],
                                        average: obj.average,
                                    },
                                    ...state.userRecords.slice(index + 1)
                                ]
                            };
                            return newState;
                        }
                        this.setState(setStateUserRecords);
                        function setStateSelectedRecord(state, props) {
                            const newState = { ...state, selectedUserRecord: state.userRecords[0] };
                            return newState;
                        }
                        this.setState(setStateSelectedRecord);
                        console.log("onRadioClick selectedUserRecord", this.state.selectedUserRecord);
                
                    })

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

    mapCubeTypes(newState) {
        const result = []
        let idCounter = 0;

        newState.cubetypes.forEach(type => {
            idCounter += 1
            result.push({ id: idCounter, cubetype: type, average: "No Average Yet" })
        })

        function setStateUserRecords(state, props) {
            const newState = { ...state, userRecords: result };
            return newState;
        }
        this.setState(setStateUserRecords);

        console.log(result)
    }

    render() {
        const columns = [
            {
                field: 'cubetype',
                headerName: 'Cube Type',
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
            { field: 'average', headerName: 'Lifetime Average', width: 300 }
        ];

        if (this.state.user !== {}) {
            return (
                <div className='App'>
                    <h1>Account</h1>
                    <h2>{this.state.user.name}</h2>
                    <div>
                        <h2>Lifetime Averages</h2>
                        {this.state.userRecords !== [] &&
                            <div style={{ height: 450, width: '100%', align: "left" }}>
                                <DataGrid getRowId={(row) => row.id} rows={this.state.userRecords} columns={columns} />
                            </div>
                        }
                        {this.state.selectedUserRecord.average === 'No Average Yet' &&
                            <Button id="StarterTournament" component={Link} to={{ pathname: `/starter-competition/${this.state.selectedUserRecord.cubetype}` }}
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