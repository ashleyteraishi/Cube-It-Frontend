import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Account from './Account';
import { SERVER_URL } from '../constants.js'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
    // may need to use something besides state for use with spring
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        setUser(userObject);
        addUser(userObject);
        document.getElementById("signInDiv").style.display = "none";
    }

    function handleSignout(event) {
        setUser({});
        deleteUserLogin();
        document.getElementById("signInDiv").style.display = "flex";
    }

    const addUser = (user) => {
        console.log("request options");
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({email: user.email, name: user.name})
        };

        console.log("request body: ",requestOptions.body);
    
        console.log("post");
        fetch(`${SERVER_URL}user`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.error(err));
    }

    const deleteUserLogin = () => {
        console.log("request options");
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };
    
        console.log("delete");
        fetch(`${SERVER_URL}user`, requestOptions)
            .then(() => {
                console.log("successful logout");
            })
            .catch((err) => console.error(err));
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