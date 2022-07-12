import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

function Login() {

  // may need to use something besides state for use with spring
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").style.display = "none";
  }

  function handleSignout(event) {
    setUser({});
    document.getElementById("signInDiv").style.display = "flex";
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "534133773274-8mkam8pvhcli5msdub8uin592ickusi2.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  // if no user is signed in, show sign in button
  // if user is already signed in, show sign out button

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <h1>Welcome to Cube-It</h1>
      <h2>An online speed-cubing platform</h2>
      
      <h3 style={{marginTop:'20px', marginBottom:'40px'}}><Link to="/tournaments" class="link">Upcoming Tournaments</Link></h3>

      <div id="signInDiv"></div>
    
      { Object.keys(user).length !== 0 &&
        <button id="signOutButton" onClick={ (e) => handleSignout(e) }>Sign Out</button>
      }
    </div>
  );
}

export default Login;