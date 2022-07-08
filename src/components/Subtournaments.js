import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Cookies from 'js-cookie';
import { SERVER_URL } from '../constants.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Subtournaments extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    console.log("=Subtournaments.cnstr " + JSON.stringify(props.location));
    this.state = { selected: 0, subtournaments: [], subtournamentSelected: {}, isLoading: true };
  }

  componentDidMount() {
    this.fetchSubtournaments();
  }

  fetchSubtournaments = () => {
    console.log("Events.fetchSubtournaments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}tournaments/${this.props.match.params.tournamentId}/subtournaments`,
      {
        method: 'GET',
        headers: { 'X-XSRF-TOKEN': token },
        crendentials: 'include'
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (Array.isArray(responseData.subtournaments)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({
            subtournaments: responseData.subtournaments.map((subtournament, index) => {
              return { id: index, ...subtournament };
            })
          });

          function setStateSubtournament(state, props) {
            const newState = { ...state, subtournamentSelected: state.subtournaments[0] };
            return newState;
          }
          this.setState(setStateSubtournament);
          console.log(this.state.subtournamentSelected);

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
    console.log("Subtournament.onRadioClick " + event.target.value);
    this.setState({ selected: event.target.value });
    function setStateSubtournament(state, props) {
      const newState = { ...state, subtournamentSelected: state.subtournaments[event.target.value] };
      return newState;
    }
    this.setState(setStateSubtournament);
    console.log(this.state.subtournamentSelected);
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
    ];

    // if the fetch call returns subtournaments
    if (!this.state.isLoading && this.state.subtournaments.length !== 0) {
      return (
        <div className="App">

          <div style={{ width: '100%' }}>
            For DEBUG:  display state.
            {JSON.stringify(this.state)}
          </div>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={this.state.subtournaments} columns={columns} />
          </div>
          <Button id="Brackets" component={Link} to={{ pathname: `/subtournaments/${this.state.subtournamentSelected.subtournamentId}/brackets` }}
            variant="outlined" color="primary" disabled={this.state.subtournaments.length === 0} style={{ margin: 10 }}>
            View Brackets
          </Button>
          <Button id="SubtournamentSignup"
            variant="outlined" color="primary" >
            Sign Up
          </Button>
          <ToastContainer autoClose={1500} />
        </div>
      )

    }
    // else if the fetch call returns an empty list
    else if (!this.state.isLoading) {
      return (
        <div className="App">
          <div style={{ height: 400, width: '100%' }}>
            <h1>No Subtournaments for Selected Tournament</h1>
            <h2>Check Back Soon!</h2>
          </div>
          <ToastContainer autoClose={1500} />
        </div>
      )
    }
    // else, waiting for the fetch - loading
    else {
      return (
        <div className="App">
          <div style={{ height: 400, width: '100%' }}>
            
          </div>
          <ToastContainer autoClose={1500} />
        </div>
      )
    }
  }
}

export default Subtournaments;