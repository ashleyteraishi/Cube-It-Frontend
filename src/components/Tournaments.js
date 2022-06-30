import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';
import { Radio } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Tournaments extends React.Component {
    constructor(props) {
      super(props);
      console.log("=Tournaments.cnstr "+ JSON.stringify(props.location));
      this.state = { selected: 0, tournaments :  [], selectedId: 0};
    } 
    
     componentDidMount() {
      this.fetchTournaments();
    }
 
    fetchTournaments = () => {
      console.log("Tournaments.fetchTournaments");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}tournaments`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token}
        } )
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.tournaments)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({ 
            tournaments: responseData.tournaments.map((tournament,index) => {
                  return {id:index, ...tournament};
            })
          });
        } else {
          toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
        }        
      })
      .catch(err => console.error(err));
    }
    
    onRadioClick = (event) => {
      console.log("Tournament.onRadioClick " + event.target.value);
      this.setState({ selected: event.target.value });
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
          { field: 'startDate', headerName: 'Start Date', width: 250 },
          { field: 'endDate', headerName: 'End Date', width: 250 },
        ];
        
        const tournamentSelected = this.state.tournaments[this.state.selected];
        console.log("Tournament selected: " + tournamentSelected);

        return(
            <div className="App">
              
              <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.tournaments} columns={columns} />
              </div>
              <Button id="Subtournaments" component={Link} to={{ pathname: '/tournaments/subtournaments', tournament: tournamentSelected }}
                variant="outlined" color="primary" disabled={this.state.tournaments.length === 0} style={{ margin: 10 }}>
                View Subtournaments
              </Button>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
        };
}

export default Tournaments;