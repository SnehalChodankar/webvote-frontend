import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import axios from 'axios';

import FooterWV from '../common/footerComponent';
import Delayed from '../common/delayed';
import CandidatesDisplay from '../common/candidatesDisplay';
import CandidateGraph from '../common/candidateGraph';
import AdminNavbar from '../navbar/adminNavbar';

import { Grid, Paper, TextField } from '@material-ui/core';

require('dotenv').config();

/*
------------------------------------------Detailed Result------------------------------------------
This component is used to display the detailed result after voting period is over, and to display the winner.
It imports candidateDetails component and candidate graph component.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to get accepted Candidates:
- getAcceptedCandidates()
    :- Sends axios request to server.js file on path '/getCandidates' to get all the candidates related to
       a particular electionAddress.
---------------------------------------------------------------------------------------------------
*/

function DetailedResultAdmin() {
    //-----------------------------------Section Start: Variables & States----------------------------------------------

    let history = useHistory();
    let location = useLocation();

    const [data, setData] = useState(null);
    const [acceptedCandidates, setAcceptedCandidates] = useState(null);
    //-----------------------------------Section Ended: Variables & States----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Check if user is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/user'
        })
            .then(res => {
                setData(res.data);
                if (res.data.username == null) {
                    history.push('/');
                }
                getAcceptedCandidates();
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Functions to getCandidates-------------------------------

    /**
     * Get all accepted candidates of particular election.
     */
    const getAcceptedCandidates = () => {
        axios({
            method: "POST",
            data: {
                electionAddress: location.state.electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getCandidates',
        })
            .then(res => {
                setAcceptedCandidates(res.data);
            });
    }
    //-------------------------------Section Ended: Functions to getCandidates-------------------------------

    /**
     * Converts date and time to string format.
     * @param {date} _date date and time to convert.
     * @returns {string} converted local date string.
     */
    const convertISOtoLocal = (_date) => {
        var date = new Date(_date).toDateString();
        var time = new Date(_date).toLocaleTimeString();
        var finalDate = date + ", " + time;
        return finalDate;
    }

    return (
        <Delayed waitBeforeShow={500}>
            {
                data ?
                    <AdminNavbar data={data} />
                    : null
            }

            <Container style={{ marginLeft: "40px", marginTop: "25px" }}>
                {
                    acceptedCandidates ?
                        <CandidateGraph acceptedCandidates={acceptedCandidates} electionAddress={location.state.electionAddress} />
                        : null
                }

                <Grid style={{ position: "relative" }}>
                    <Paper elevation="10" style={{ width: "400px", paddingBottom: "50px" }}>
                        <h3 style={{ padding: "10px", backgroundColor: "#E4EBE9" }}>Election Details</h3>
                        <TextField multiline label="Election Title" style={{ width: "300px" }} disabled value={location.state.type} />
                        <br />
                        <TextField multiline label="College" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.college} />
                        <br />
                        <TextField multiline label="Election Address" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.electionAddress} />
                        <br />
                        <TextField label='Registration Started On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.registrationStartDateTime)} />
                        <br />
                        <TextField label='Registration Ended On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.registrationEndDateTime)} />
                        <br />
                        <TextField label='Voting Started On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.votingStartDateTime)} />
                        <br />
                        <TextField label='Voting Ended On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.votingEndDateTime)} />
                        <br />
                    </Paper>
                </Grid>

                <CandidatesDisplay acceptedCandidates={acceptedCandidates} />

            </Container>
            <br /><br />
            <FooterWV />
        </Delayed>
    );
}

export default DetailedResultAdmin;