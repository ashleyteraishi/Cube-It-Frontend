import React, { useState, useContext, useEffect } from 'react';
import { SERVER_URL } from '../constants.js'

function Account() {
    const [user, setUser] = useState({});

    useEffect(() => {
        console.log("request options");
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        };

        console.log("get");
        fetch(`${SERVER_URL}user`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                setUser(data);
            })
            .catch((err) => console.error(err));
    }, [user])
    
    return (
        <div className='App'>
            <h1>Account</h1>
            <h2>{user.name}</h2>
        </div>
    );
}

export default Account;