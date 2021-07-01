import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import axios from 'axios';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import CandidatesDisplay from '../common/candidatesDisplay';
// import CandidateVoteCountTable from '../common/candidatesVoteCountTable';
import AdminNavbar from '../navbar/adminNavbar';

import { Grid, Paper, TextField, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

require('dotenv').config();

/*
-------------------------------------------Statistics Component--------------------------------------------
This component is used to display statistics to the admin after election goes live.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to get accepted Candidates:
- getAcceptedCandidates()
    :- Sends axios request to server.js file on path '/getCandidates' to get all the candidates related to
       a particular electionAddress.
--------------------------------------------------------------------------------------------------------------
*/

function StatisticsAdmin() {

    let history = useHistory();
    let location = useLocation();

    //-----------------------------------Section Start: State Variables----------------------------------------------
    const [data, setData] = useState(null);
    const [acceptedCandidates, setAcceptedCandidates] = useState(null);
    //-----------------------------------Section Ended: State Variables----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Checks if admin is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/user',
        })
            .then(res => {
                setData(res.data);
                if (res.data.username == null) {
                    history.push('/admin/login');
                }
                getAcceptedCandidates();
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Function to get accepted Candidates-------------------------------

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
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/getCandidates',
        })
            .then(res => {
                setAcceptedCandidates(res.data);
            });
    }
    //-------------------------------Section Ended: Function to get accepted Candidates-------------------------------

    /**
     * Converts given date and time to string format.
     * @param {date} _date date and time to convert.
     * @returns {string} converted date.
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

            <Container style={{ marginLeft: "40px" }}>
                <Grid style={{ position: "relative" }}>
                    <Paper elevation="10" style={{ width: "1260px", marginTop: "25px" }}>
                        <Card>
                            <CardHeader
                                title="Election Details"
                                style={{ backgroundColor: "#E4EBE9" }}
                            />
                            <CardContent style={{ fontSize: "18px" }}>
                                <Typography gutterBottom>
                                    <p style={{ marginLeft: "30px", textAlign: "left" }}>
                                        <TextField label="Election Title" style={{ width: "250px" }} disabled value={location.state.type} />
                                        <TextField label="Election Address" style={{ marginLeft: "20px", width: "400px" }} disabled value={location.state.electionAddress} />
                                        <TextField label="College" style={{ marginLeft: "20px", width: "500px" }} disabled value={location.state.college} /><br />
                                        <TextField label='Voting Started On' style={{ marginTop: "20px", width: "250px" }} disabled value={convertISOtoLocal(location.state.votingStartDateTime)} />
                                        <TextField label='Voting Ends On' style={{ marginTop: "20px", marginLeft: "20px", width: "250px" }} disabled value={convertISOtoLocal(location.state.votingEndDateTime)} />
                                    </p>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>

                {/* {
                    acceptedCandidates ?
                        <CandidateVoteCountTable acceptedCandidates={acceptedCandidates} electionAddress={location.state.electionAddress} />
                        : null
                } */}

                <CandidatesDisplay acceptedCandidates={acceptedCandidates} />

                <br /><br />

            </Container>
            <br />
            <FooterWV />
        </Delayed>
    );
}

export default StatisticsAdmin;