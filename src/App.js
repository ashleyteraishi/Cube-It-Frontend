import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import TournamentList from './components/TournamentList';

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
        <Routes>
          <Route exact path='/tournaments' element={<TournamentList/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
