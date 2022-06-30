import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';
import {withRouter} from 'react-router';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Brackets extends React.Component {
    constructor(props) {
      super(props);
      console.log(props);
      console.log("=Brackets.cnstr "+ JSON.stringify(props.location));
      this.state = {brackets :  [] };
    }

    componentDidMount() {
      const subtournamentId = this.props.match.params.subtournamentId;
      this.fetchBrackets(subtournamentId);
    }
 
    fetchBrackets = (subtournamentId) => {
      console.log("Brackets.fetchBrackets");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}subtournaments/${subtournamentId}/brackets`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token}
        } )
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.brackets)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({ 
            brackets: responseData.brackets.map((bracket,index) => {
                  return {id:index, ...bracket};
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
  
 
    render() {
       const columns = [
          { field: 'bracket_pos', headerName: 'Bracket Position', width: 400 },
          { field: 'competitionstarttime', headerName: 'Start Time', width: 400 },
          { field: 'subtournamentid', headerName: 'Subtournament Id', width: 400 },
        ];
        

      
        return(
            <div className="App">
              
              <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.brackets} columns={columns} />
              </div>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
        };
}

export default withRouter(Brackets);