import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import { SERVER_URL } from '../constants.js';
import { Radio } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading';
import AddTournament from './AddTournament';
import jwt_decode from 'jwt-decode';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Tournaments extends React.Component {
  constructor(props) {
    super(props);
    console.log("=Tournaments.cnstr " + JSON.stringify(props.location));
    this.state = { selected: 0, tournaments: [], tournamentSelected: {}, isLoading: true, user: {} };
  }

  componentDidMount() {
    this.fetchTournaments();
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
        return newState;
      }
      this.setState(setStateUser);
    }
  }

  fetchTournaments = () => {
    console.log("Tournaments.fetchTournaments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}tournaments`,
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
        if (Array.isArray(responseData.tournaments)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({
            tournaments: responseData.tournaments.map((tournament, index) => {
              return { id: index, ...tournament };
            })
          });
          console.log(this.state.tournaments)

          function setStateTournament(state, props) {
            const newState = { ...state, tournamentSelected: state.tournaments[0] };
            return newState;
          }
          this.setState(setStateTournament);
          console.log(this.state.tournamentSelected);

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
      .catch(err => console.error(err));
  }

  addTournament = (tournament) => {
    const token = Cookies.get('XSRF-TOKEN');

    fetch(`${SERVER_URL}assignment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token,
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(tournament),
      })
      .then(res => {
        if (res.ok) {
          toast.success("Tournament successfully added", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchTournaments();
        } else {
          toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }
      })
      .catch(err => {
        toast.error("Error when adding", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      })
  }

  onRadioClick = (event) => {
    console.log("Tournament.onRadioClick " + event.target.value);
    this.setState({ selected: event.target.value });
    function setStateTournament(state, props) {
      const newState = { ...state, tournamentSelected: state.tournaments[event.target.value] };
      return newState;
    }
    this.setState(setStateTournament);
    console.log(this.state.tournamentSelected);
  }

  render() {
    const columns = [
      {
        field: 'tournamentName',
        headerName: 'Name',
        width: 400,
        renderCell: (params) => (
          <div>
            <Radio
              checked={params.row.id === this.state.selected}
              onChange={this.onRadioClick}
              value={params.row.id}
              color="default"
              size="small"
            />
            {params.value}
          </div>
        )
      },
      { field: 'startDate', headerName: 'Start Date', width: 250 },
      { field: 'endDate', headerName: 'End Date', width: 250 },
    ];

    // if the fetch call returns tournaments
    if (!this.state.isLoading && this.state.tournaments.length !== 0) {
      return (
        <div className="App">

          <div style={{ width: '100%' }}>
            For DEBUG:  display state.
            {JSON.stringify(this.state)}
          </div>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={this.state.tournaments} columns={columns} />
          </div>
          <Button id="Subtournaments" component={Link} to={{ pathname: `/tournaments/${this.state.tournamentSelected.tournamentId}/subtournaments` }}
            variant="outlined" color="primary" disabled={this.state.tournaments.length === 0} style={{ margin: 10 }}>
            View Subtournaments
          </Button>
          <Button id="AddTournament">
            <AddTournament addTournament={this.addTournament} />
          </Button>

          <ToastContainer autoClose={1500} />
        </div>
      );
    }

    // else if the fetch call returns empty list
    else if (!this.state.isLoading) {
      return (
        <div className="App">

          <div style={{ height: 400, width: '100%' }}>
            <h1>No Upcoming Tournaments</h1>
            <Button id="AddTournament">
              <AddTournament addTournament={this.addTournament} />
            </Button>
          </div>

          <ToastContainer autoClose={1500} />
        </div>
      );
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
      );
    }
  };
}

export default Tournaments;