import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

import axios from 'axios';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import AdminNavbar from '../navbar/adminNavbar';

import { Grid, Card, CardContent, Typography, CardHeader } from '@material-ui/core/';

require('dotenv').config();

/*
-----------------------------------------Upcoming Elections-----------------------------------------------------
This component is used to display all the upcomingelections for Admin and also allows them to 
view candidate requests and cancel election.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to getElections:
- getElections()
    :- Sends an axios request to server.js file on path '/getElections' which returns a list of elections 
       present in registration state.

Functions to cancel election
- cancelElection(_electionAddress)
    :- Sends an axios request to server.js file on "/deleteElection" path to delete the election passed as 
       parameter and further call deleteCandidates() method to delete candidates.
- deletCandidates(_electionAddress)
    :- Sends an axios request to server.js file on "/deleteElectionCandidates" path to delete the camdidates
       and further call deleteCandidateRequests() method to delete candidate requests.
- deleteCandidateRequests(_electionAddress)
    :- Sends an axios request to server.js file on "/deleteElectionCandidateRequests" path to delete 
       the candidate requests and further call deleteCandidateRequests() method to delete candidate requests.
------------------------------------------------------------------------------------------------------------
*/

function AdminUpcomingElections() {
    //-----------------------------------Section Start: State Variables----------------------------------------------
    let history = useHistory();

    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [isNotUpcoming, setIsNotUpcoming] = useState(false);

    //-----------------------------------Section Ended: State Variables----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Checks if the admin is logged in.
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

    //-------------------------------Section Start: Function to getElections-------------------------------

    /**
     * Get all elections with registration state.
     */
    const getElections = () => {
        axios({
            method: "POST",
            data: {
                status: "registration"
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getElections',
        })
            .then(res => {
                setElections(res.data);
                if (res.data.length === 0)
                    setIsNotUpcoming(true);
            });
    }
    //-------------------------------Section Ended: Function to getElections-------------------------------

    //-------------------------------Section Start: Functions to cancel election-------------------------------

    /**
     * Deletes the election from the database.
     * @param {string} _electionAddress election address hex
     */
    const cancelElection = (_electionAddress) => {
        axios({
            method: "DELETE",
            data: {
                electionAddress: _electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/deleteElection',
        })
            .then(res => {
                deleteCandidates(_electionAddress);
            });
    }

    /**
     * Deletes the candidates from the database.
     * @param {string} _electionAddress election address hex
     */
    const deleteCandidates = (_electionAddress) => {
        axios({
            method: "DELETE",
            data: {
                electionAddress: _electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/deleteElectionCandidates',
        })
            .then(res => {
                deleteCandidateRequests(_electionAddress);
            });
    }

    /**
     * Deletes the candidate requests from the database.
     * @param {string} _electionAddress election address hex
     */
    const deleteCandidateRequests = (_electionAddress) => {
        axios({
            method: "DELETE",
            data: {
                electionAddress: _electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/deleteElectionCandidateRequests',
        })
            .then(res => {
                alert(res.data);
                window.location.reload(false);
            });
    }
    //-------------------------------Section Ended: Functions to cancel election-------------------------------

    /**
     * Route to candidate request page.
     * @param {JSON} election election details
     */
    const displayRequests = (election) => {
        history.push({
            pathname: '/admin/upcoming/candidateRequests',
            state: election
        });
    }

    /**
     * Checks if registration ended
     * @param {date} _registrationEndDateTime registration end date time
     * @returns {boolean} true if ended.
     */
    const checkDate = (_registrationEndDateTime) => {
        console.log("checkRegStartDate: ", _registrationEndDateTime);
        var current = new Date().toLocaleString();
        var regDate = new Date(_registrationEndDateTime).toLocaleString();
        console.log("current from checkRegenddate: ", current);
        console.log("regdate from checkregenddate: ", regDate);
        if (current > regDate) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Checks if registration started
     * @param {date} _registrationStartDateTime registration start date time
     * @returns {boolean} true if started.
     */
    const checkRegStartDate = (_registrationStartDateTime) => {
        console.log("checkRegStartDate: ", _registrationStartDateTime);
        var current = new Date().toLocaleString();
        var regDate = new Date(_registrationStartDateTime).toLocaleString();
        console.log("current from checkRegstartdate: ", current);
        console.log("regdate from checkregstartdate: ", regDate);

        if (current > regDate) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Converts given date and time to string format.
     * @param {date} _date date and time to convert.
     * @returns {string} converted date.
     */
    const convertISOtoLocal = (_date) => {
        console.log("convertISOtoLocal: ", _date);
        var date = new Date(_date).toDateString();
        var time = new Date(_date).toLocaleTimeString();
        var finalDate = date + ", " + time;
        return finalDate;
    }

    /**
     * Checks election owner
     * @param {string} _username username
     * @returns {boolean} true if matches
     */
    const checkElectionOwner = (_username) => {
        if (data.username === _username)
            return true;
        else
            return false;
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
                        <Grid
                            container
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
                                                subheader={
                                                    checkDate(election.registrationEndDateTime) ?
                                                        <span>
                                                            {
                                                                checkRegStartDate(election.registrationStartDateTime) ?
                                                                    <span>
                                                                        {election.college}
                                                                        <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span className="badge rounded-pill bg-warning ">Registration Not Started Yet</span></h5>
                                                                    </span>
                                                                    :
                                                                    <span>
                                                                        {election.college}
                                                                        <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span className="badge rounded-pill bg-success ">Registration Open</span></h5>
                                                                    </span>
                                                            }
                                                        </span>
                                                        :
                                                        <span>
                                                            {election.college}
                                                            <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span className="badge rounded-pill bg-danger ">Registration Closed</span></h5>
                                                        </span>
                                                }
                                            />

                                            <CardContent style={{ fontSize: "18px" }}>
                                                <Typography gutterBottom>
                                                    {
                                                        checkRegStartDate(election.registrationStartDateTime) ?
                                                            <span>
                                                                <b>Registration Starts at: </b>{convertISOtoLocal(election.registrationStartDateTime)}<br />
                                                            </span>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        checkDate(election.registrationEndDateTime) ?
                                                            <span>
                                                                <b>Registration Ends at: </b>{convertISOtoLocal(election.registrationEndDateTime)}<br />
                                                            </span>
                                                            :
                                                            null
                                                    }
                                                    <b>Election Starts at: </b>{convertISOtoLocal(election.votingStartDateTime)}
                                                    <br />
                                                    <b>Election Ends at: </b>{convertISOtoLocal(election.votingEndDateTime)}
                                                    <br />
                                                    {
                                                        checkElectionOwner(election.adminUsername) ?
                                                            <span>
                                                                {
                                                                    checkRegStartDate(election.registrationStartDateTime) ?
                                                                        null
                                                                        :
                                                                        <Button onClick={() => { displayRequests(election) }} className="btn btn-primary" style={{ marginTop: "10px" }}>Candidate Requests</Button>
                                                                }
                                                                <Button onClick={() => { cancelElection(election.electionAddress) }} className="btn btn-danger" style={{ marginLeft: "180px", marginTop: "10px" }}>Cancel Election</Button>
                                                            </span>
                                                            : null
                                                    }
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
                isNotUpcoming ?
                    <div id="nodata" style={{ maxHeight: "800px", alignContent: "center", paddingTop: "156px", paddingBottom: "210px" }}>
                        <i class="fas fa-cubes fa-5x"></i>
                        <p style={{ fontSize: "20px" }}>
                            No Upcoming Elections!
                            </p>
                    </div>
                    : null
            }
        </Delayed>
    );
}

export default AdminUpcomingElections;