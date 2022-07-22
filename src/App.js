import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom';
import Tournaments from './components/Tournaments';
import Subtournaments from './components/Subtournaments';
import Brackets from './components/Brackets';
import Login from './components/Login';
import UserRecord from './components/User_Records';

function App() {
  return (
    <div className="App">
      <AppBar position="static" color="default">
        <Toolbar>
           <Typography variant="h6" color="inherit">
            CubeIt
           </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Switch>
          <Route path='/tournaments/:tournamentId/subtournaments' component={withRouter(Subtournaments)}/>
          <Route path='/subtournaments/:subtournamentId/brackets' component={Brackets}/>
          <Route path='/tournaments' component={withRouter(Tournaments)}/>
          <Route exact path='/' component={Login}/>
		  <Route path='/alluserrecord' component={UserRecord} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
