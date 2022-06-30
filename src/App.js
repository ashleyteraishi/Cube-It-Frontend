import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Tournaments from './components/Tournaments';
import Subtournaments from './components/Subtournaments';

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
          <Route exact path='/tournaments' component={Tournaments}/>
          <Route exact path='/tournaments/:tournamentId/subtournaments' component={Subtournaments}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
