import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

require('dotenv').config();

function LogoutBtn() {
    let history = useHistory();

    /**
     * Clears the session data and logs the user out.
     */
    const logoutUser = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/logout',
        })
            .then(res => {
                console.log("success");
                history.push('/');
            });
    }

    return (
        <span>
            <Button onClick={logoutUser} variant="outline-success"><i class="fas fa-sign-out-alt"></i> Logout</Button>
        </span>
    );
}

export default LogoutBtn;