import { Link } from 'react-router-dom';

function Home() {

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', height: '80vh'}}>
      <img src={`${process.env.PUBLIC_URL}/CubeItVersionThickerLines.png`} alt='logo'></img>
      <h1>Welcome to Cube-It</h1>
      <h2>An online speed-cubing platform</h2>
      
      <h3 style={{marginTop:'20px', marginBottom:'40px'}}><Link to="/tournaments" className="link">Upcoming Tournaments</Link></h3>
    </div>
    
  );
}

export default Home;