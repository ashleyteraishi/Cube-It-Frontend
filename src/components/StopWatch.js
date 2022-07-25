import React, { useState } from "react";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";
import Cookies from 'js-cookie';

function StopWatch() {
    const [isActive, setIsActive] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const [time, setTime] = useState(0);

    React.useEffect(() => {
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

    // original function
    // const handleStop = () => {
    //     setIsStopped(true);
    //     console.log(time)
    // };

    const handleStop = () => {
        setIsStopped(true);
        console.log(time)
        addUserTime(time)
    };



    const addUserTime = (time) => {
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': token },
                    credentials: 'include',
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

    then(res => {
        if (res.ok) {
          toast.success("Student successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
        } else {
          toast.error("Error when adding", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }})
    .catch(err => {
      toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
    })


    fetchUserTime = (id) => {
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}/users/${id}`,
            {
                method: 'GET',
                headers: { 'X-XSRF-TOKEN': token },
                credentials: 'include'
            } )
        .then((response) => response.json())
        .then((responseData) => {

        })
    }

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