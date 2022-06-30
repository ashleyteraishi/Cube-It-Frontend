import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class Tournaments extends React.Component {
    constructor(props) {
      super(props);
      console.log("=Tournaments.cnstr "+ JSON.stringify(props.location));
      this.state = {  tournaments :  [] };
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
      .catch(err => {
        toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err); 
      })
    }
  
 
    render() {
       const columns = [
          { field: 'tournamentName', headerName: 'Name', width: 400 },
          { field: 'startDate', headerName: 'Start Date', width: 250 },
          { field: 'endDate', headerName: 'End Date', width: 250 },
        ];
        

      
        return(
            <div className="App">
              
              <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.tournaments} columns={columns} />
              </div>
              <ToastContainer autoClose={1500} />   
            </div>
            ); 
        };
}

export default Tournaments;