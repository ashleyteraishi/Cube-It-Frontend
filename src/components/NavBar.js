import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Account from './Account';
import Login from './Login';

const NavBar = () => {
    return (
        <div className='App'>
            <div id='NavBar'>
                <ul>
                    <li id='logo'>
                        <Link to="/" className='link'>Cube-It</Link>
                    </li>
                    <li>
                        <Link to="/" className='link'>Home</Link>
                    </li>
                    <li>
                        <Link to="/tournaments" className='link'>Tournaments</Link>
                    </li>
                    <Login/>
                </ul>

            </div>
        </div>

    )
}

export default NavBar;