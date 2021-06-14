import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import VoterNavbar from '../navbar/voterNavbar';

import { Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

require('dotenv').config();

/*
-----------------------------------------Results Component--------------------------------------
This component is used to dispaly all the elections that are in results state.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to getElections:
- getElections()
    :- Sends an axios request to server.js file on path '/getElections' which returns a list of elections 
       present in results state.
------------------------------------------------------------------------------------------------
*/

function ResultsVoter() {
    let history = useHistory();

    //-----------------------------------Section Start: State Variables----------------------------------------------
    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [isNotEnded, setIsNotEnded] = useState(false);

    //-----------------------------------Section Ended: State Variables----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Check if user is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/user',
        })
            .then(res => {
                setData(res.data);
                if (res.data.prNumber == null) {
                    history.push('/');
                }
                getElections();
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Function to getElections-------------------------------

    /**
     * Get all elections in results state.
     */
    const getElections = () => {
        axios({
            method: "POST",
            data: {
                status: "results"
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getElections',
        })
            .then(res => {
                setElections(res.data);
                if (res.data.length === 0)
                    setIsNotEnded(true);
            });
    }
    //-------------------------------Section Ended: Function to getElections-------------------------------

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

    /**
     * Route to detailed results page of particular election.
     * @param {JSON} election json election object.
     */
    const gotoElectionResults = (election) => {
        history.push({
            pathname: '/voter/results/detailedResult',
            state: election
        })
    }

    return (
        <div>
            <Delayed waitBeforeShow={500}>
                <div>
                    {
                        data ?
                            <VoterNavbar data={data} />
                            : null
                    }
                    <br />
                    <Container>
                        {
                            elections ?
                                <Grid container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    {
                                        elections.map((election) =>
                                            <Grid item xs={12} sm={6} md={6} key={election._id}>
                                                <Card elevation="10">
                                                    <CardHeader
                                                        title={election.type}
                                                        style={{ backgroundColor: "#E4EBE9" }}
                                                        subheader=
                                                        {
                                                            <span>
                                                                {election.college}
                                                                <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span class="badge rounded-pill bg-danger ">Ended</span></h5>
                                                            </span>
                                                        }
                                                    />

                                                    <CardContent style={{ fontSize: "18px" }}>
                                                        <Typography gutterBottom>
                                                            <b>Election Started at: </b>{convertISOtoLocal(election.votingStartDateTime)}<br />
                                                            <b>Election Ended at: </b>{convertISOtoLocal(election.votingEndDateTime)}<br />
                                                            <br />
                                                            <Button onClick={() => { gotoElectionResults(election) }} className="btn btn-warning" style={{ marginLeft: "5px" }}><span name={election.electionAddress}>Results</span></Button>
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                                : null
                        }
                    </Container>
                    <br />
                    <br />
                    <FooterWV />
                </div>
                {
                    isNotEnded ?
                        <div id="nodata" style={{ maxHeight: "800px", alignContent: "center", paddingTop: "156px", paddingBottom: "210px" }}>
                            <i class="fas fa-cubes fa-5x"></i>
                            <p style={{ fontSize: "20px" }}>
                                No Results Available!
                        </p>
                        </div>
                        : null
                }
            </Delayed>
        </div>
    );
}

export default ResultsVoter;