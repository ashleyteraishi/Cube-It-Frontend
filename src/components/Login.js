import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Account from './Account';

const Login = () => {
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

    return (
        <div className='App'>
            {Object.keys(user).length !== 0 &&
                <li>
                    <Link to="/account" className='link'>Account</Link>
                </li>
            }
            <li id='login'>
                <div id="signInDiv"></div>
            </li>
            {Object.keys(user).length !== 0 &&
                <li id='logout'>
                    <button id="signOutButton" onClick={(e) => handleSignout(e)}>Sign Out</button>
                </li>
            }



        </div>

    )
}

export default Login;