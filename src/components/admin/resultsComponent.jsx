import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import axios from 'axios';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import AdminNavbar from '../navbar/adminNavbar';

import { Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

require('dotenv').config();

/*
-----------------------------------------Results Component---------------------------------------------------
This component is used to dispaly all the elections that are in results state.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to get all the ended elections:
- getElections()
    :- Sends an axios request to server.js file on path '/getElections' which returns a list of elections 
       present in results state.
--------------------------------------------------------------------------------------------------------------
*/

function AdminResults() {
    //-------------------------------Section Start: Variables and States---------------------------------------

    let history = useHistory();

    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [isNotEnded, setIsNotEnded] = useState(false);

    //-------------------------------Section Ended: Variables and States---------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Checks if admin is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/user',
        })
            .then(res => {
                setData(res.data);
                if (res.data.username == null) {
                    history.push('/admin/login');
                }
                getElections();
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Function to get all the ended elections------------------

    /**
     * Fetch all elections with result state.
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
    //-------------------------------Section Ended: Function to get all the ended elections------------------

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

    /**
     * Route to detailed results page.
     * @param {JSON} election election details
     */
    const gotoElectionResults = (election) => {
        history.push({
            pathname: '/admin/results/detailedResult',
            state: election
        })
    }

    return (
        <Delayed waitBeforeShow={500}>
            {
                data ?
                    <AdminNavbar data={data} />
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
    );
}

export default AdminResults;