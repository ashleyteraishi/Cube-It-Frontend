import React from 'react';

class Account extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className='App'>
                <h1>Account Page</h1>

            </div>
        )

    }
}
export default Account;