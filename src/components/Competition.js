import React, { useState, useContext, useEffect } from 'react';
import { SERVER_URL } from '../constants.js'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

function Competition() {
    const [user, setUser] = useState({});

    useEffect(() => {
        if (localStorage.getItem('jwt') === null) {
            setUser({});
        }
        else {
            const storedJwt = localStorage.getItem('jwt');
            console.log("account jwt:", jwt_decode(storedJwt));
            setUser(jwt_decode(storedJwt));
        }

    }, [])



    return (
        <div className='App'>
            <h1>Placeholder Competition</h1>
        </div>
    );
}

export default Competition;