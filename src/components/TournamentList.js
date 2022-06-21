import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataGrid} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 


class UpcomingTournaments extends React.Component {
    constructor(props) {
      super(props);
      console.log("UpcomingTournaments.cnstr "+ JSON.stringify(props.location));
      this.state = {  tournaments :  [] };
    } 
    
     componentDidMount() {
      this.fetchTournaments();
    }
 
    fetchTournaments = () => {
      console.log("UpcomingTournaments.fetchTournaments");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}upcoming-tournaments/`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token },
          credentials:'include'
        } )
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.tournaments)) {
          // add attribute "id" to each row. Required for DataGrid,  id is index of row (i.e. 0, 1, 2, ...)  
          this.setState({ 
            tournaments: responseData.tournaments.map((r,index) => {
                  return {id:index, ...r};
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
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'startDate', headerName: 'Start Date', width: 250},
        { field: 'startTime', headerName: 'Start Time (PST)', width: 150 , editable:true}
        ];
        
        const tournaments = this.props.location.tournaments;
      
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

export default UpcomingTournaments;