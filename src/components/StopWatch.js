import React, { useState } from "react";
import Timer from "./Timer";
import { SERVER_URL } from '../constants.js';
import ControlButtons from "./ControlButtons";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";

function StopWatch(props) {
    const [user, setUser] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const [time, setTime] = useState(0);
    console.log("Stopwatch bracketid:", props.bracketid)

    React.useEffect(() => {
        if(localStorage.getItem('jwt') === null) {
            setUser({});
        }
        else {
            const storedJwt = localStorage.getItem('jwt');
            console.log("account jwt:", jwt_decode(storedJwt));
            setUser(jwt_decode(storedJwt));
        }
        let interval = null;
        if (isStopped === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
        }, 10);
        } else {
        clearInterval(interval);
        }
        return () => {
        clearInterval(interval);
        };
    }, [isActive, isStopped]);

    const handleStart = () => {
        setIsActive(true);
        setIsStopped(false);
    };

    const handleStop = () => {
        setIsStopped(true);
        console.log(time)
        addUserTime(time)
    };

    const addUserTime = (time) => {
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}competition?bracketid=${props.bracketid}&email=${user.email}&time=${time}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': token },
                body: JSON.stringify(user)
            })
        .then(res => {
            if (res.ok) {
                console.log("SUCCESS!")
            }
            else {
                console.log("FAILED!")
            }
        })
        .catch(err => {
                console.log("CAUGHT!")
        })
    }


    // fetchUserTime = (id) => {
    //     const token = Cookies.get('XSRF-TOKEN');
    //     fetch(`${SERVER_URL}/users/${id}`,
    //         {
    //             method: 'GET',
    //             headers: { 'X-XSRF-TOKEN': token },
    //             credentials: 'include'
    //         } )
    //     .then((response) => response.json())
    //     .then((responseData) => {

    //     })
    // }

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    return (
        <div className="stop-watch">
        <Timer time={time} />
        <ControlButtons
            active={isActive}
            isPaused={isStopped}
            handleStart={handleStart}
            handleStop={handleStop}
            handleReset={handleReset}
        />
        </div>
    );
}

export default StopWatch;