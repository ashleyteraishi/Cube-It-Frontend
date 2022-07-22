import React, { useState, useContext, useEffect } from 'react';
import { SERVER_URL } from '../constants.js'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

function Account() {
    const [user, setUser] = useState({});

    useEffect(() => {
        if(localStorage.getItem('jwt') === null) {
            setUser({});
        }
        else {
            const storedJwt = localStorage.getItem('jwt');
            console.log("account jwt:", jwt_decode(storedJwt));
            setUser(jwt_decode(storedJwt));
        }
        
    }, [])
    

    if (user !== {}) {
        return (
            <div className='App'>
                <h1>Account</h1>
                <h2>{user.name}</h2>
                <h2>{user.email}</h2>
            </div>
        );
    }
    else {
        return (
            <div className='App'>
                <h1>Login to view your account</h1>
            </div>
        );
    }
}

export default Account;