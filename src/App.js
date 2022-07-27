import './App.css';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Tournaments from './components/Tournaments';
import Subtournaments from './components/Subtournaments';
import Brackets from './components/Brackets';
import Login from './components/Login';
//import UserRecord from './components/UserRecords';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Account from './components/Account';
import AddTournament from './components/AddTournament';
import { useEffect } from 'react';

function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <Switch>

          <Route path='/tournaments/:tournamentId/subtournaments' component={withRouter(Subtournaments)} />
          <Route path='/subtournaments/:subtournamentId/brackets' component={Brackets} />
          <Route path='/tournaments' component={withRouter(Tournaments)} />
          <Route path='/account' component={Account} />
          <Route exact path='/' component={Home} />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;