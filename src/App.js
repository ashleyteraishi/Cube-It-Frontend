import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Tournaments from './components/Tournaments';
import Subtournaments from './components/Subtournaments';
import Brackets from './components/Brackets';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import jwt_decode from 'jwt-decode';

function App() {
  
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path='/tournaments/:tournamentId/subtournaments' component={withRouter(Subtournaments)} />
          <Route path='/subtournaments/:subtournamentId/brackets' component={Brackets} />
          <Route path='/tournaments' component={withRouter(Tournaments)} />
          <Route exact path='/' component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
