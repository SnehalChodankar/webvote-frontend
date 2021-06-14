import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import VoterNavbar from '../navbar/voterNavbar';

import { Grid, Card, CardContent, Typography, CardHeader } from '@material-ui/core';

require('dotenv').config();

/*
------------------------------------Upcoming Elections---------------------------------------
This component is used to display all the upcomingelections for voters and also allow them to contest 
for election if they are eligible.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to getElections:
- getElections()
    :- Sends an axios request to server.js file on path '/getElections' which returns a list of elections 
       present in registration state.

Function to getCandidates:
- getCandidateRequest()
    :- Sends axios request to server.js file on path '/getCandidateRequest' to get all the candidate requests
       and then call the getAcceptedCandidates function.
- getAcceptedCandidates()
    :- Sends axios request to server.js file on path '/getAllCandidates' to get all the candidates.
---------------------------------------------------------------------------------------------
*/

function UpcomingElectionsVoter() {
    let history = useHistory();

    //-----------------------------------Section Start: State Variables----------------------------------------------
    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [candidateRequests, setCandidateRequests] = useState(null);
    const [acceptedCandidates, setAcceptedCandidates] = useState(null);
    const [isNotUpcoming, setIsNotUpcoming] = useState(false);

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
     * Get all elections in registration state.
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

    //-------------------------------Section Start: Functions to getCandidates-------------------------------

    /**
     * Get all the candidate requests.
     */
    const getCandidateRequest = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getCandidateRequest',
        })
            .then(res => {
                setCandidateRequests(res.data);
                getAcceptedCandidates();
            });
    }

    /**
     * Get all the accepted candidates.
     */
    const getAcceptedCandidates = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getAllCandidates',
        })
            .then(res => {
                setAcceptedCandidates(res.data);
            });
    }
    //-------------------------------Section Ended: Functions to getCandidates-------------------------------

    /**
     * Checks if election registration is ended or not.
     * @param {date} _registrationEndDateTime election registration end date and time.
     * @returns {boolean} true if election registration ended otherwise false.
     */
    const checkDate = (_registrationEndDateTime) => {
        var current = new Date().toLocaleString();
        var regDate = new Date(_registrationEndDateTime).toLocaleString();

        if (current > regDate) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Route to candidate registration page.
     * @param {JSON} election election json object.
     */
    const candidateRegister = (election) => {
        history.push({
            pathname: '/voter/upcoming/newCandidate',
            state: election
        });
    };

    /**
     * Checks if the voter has registered as candidate or applied for particular election.
     * @param {string} electionAddr election address hex.
     * @returns {boolean} true if match found, otherwise false
     */
    const checkRegistered = (electionAddr) => {
        for (let key in candidateRequests) {
            if (candidateRequests[key].electionAddress === electionAddr) {
                if (candidateRequests[key].candidatePrNumber === data.prNumber) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get all accepted candidates of particular election.
     * @param {JSON} election election json object for single election. 
     * @param {JSON} candidate candidate json object.
     * @returns {boolean} true if election matches else false.
     */
    const getSelectedCandidates = (election, candidate) => {
        if (election.electionAddress === candidate.electionAddress) {
            document.getElementsByName(election.electionAddress)[0].setAttribute("hidden", true);
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Displays the accepted candidate list.
     * @param {string} electionAddress election address hex
     */
    const viewCandidateList = (electionAddress) => {
        if (document.getElementById(electionAddress).hidden) {
            document.getElementById(electionAddress).removeAttribute("hidden");
            document.getElementsByName(electionAddress)[1].innerHTML = "Hide Candidate List";
        }
        else {
            document.getElementById(electionAddress).setAttribute("hidden", true);
            document.getElementsByName(electionAddress)[1].innerHTML = "Show Candidate List";
        }
    }

    /**
     * Checks if election registration is started or not.
     * @param {date} _registrationStartDateTime election registration start date time.
     * @returns {boolean} true if started otherwise false.
     */
    const checkRegStartDate = (_registrationStartDateTime) => {
        var current = new Date().toLocaleString();
        var regDate = new Date(_registrationStartDateTime).toLocaleString();

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
        var date = new Date(_date).toDateString();
        var time = new Date(_date).toLocaleTimeString();
        var finalDate = date + ", " + time;
        return finalDate;
    }

    return (
        <Delayed waitBeforeShow={500}>
            <span onLoad={getCandidateRequest}>
                {
                    data ?
                        <VoterNavbar data={data} />
                        : null
                }
            </span>

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
                                                subheader=
                                                {
                                                    checkDate(election.registrationEndDateTime) ?
                                                        <span>
                                                            {
                                                                checkRegStartDate(election.registrationStartDateTime) ?
                                                                    <span>
                                                                        {election.college}
                                                                        <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span class="badge rounded-pill bg-warning ">Registration Not Started Yet</span></h5>
                                                                    </span>
                                                                    :
                                                                    <span>
                                                                        {election.college}
                                                                        <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span class="badge rounded-pill bg-success ">Registration Open</span></h5>
                                                                    </span>
                                                            }
                                                        </span>
                                                        :
                                                        <span>
                                                            {election.college}
                                                            <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span class="badge rounded-pill bg-danger ">Registration Closed</span></h5>
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
                                                    <b>Election Starts at: </b>{convertISOtoLocal(election.votingStartDateTime)}<br />
                                                    <b>Election Ends at: </b>{convertISOtoLocal(election.votingEndDateTime)}<br />
                                                    <br />

                                                    <span hidden id={election.electionAddress}>
                                                        <h5>Candidate List</h5>
                                                        {
                                                            acceptedCandidates ?
                                                                <>
                                                                    <table className="table">
                                                                        <thead>
                                                                            <th>ID</th>
                                                                            <th>Name</th>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                acceptedCandidates.map((candidate) =>
                                                                                    getSelectedCandidates(election, candidate) ?
                                                                                        <tr>
                                                                                            <td>{candidate.candidateId}</td>
                                                                                            <td>{candidate.candidateName}</td>
                                                                                        </tr>
                                                                                        : null
                                                                                )
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                                :
                                                                null
                                                        }
                                                    </span>

                                                    {
                                                        checkRegStartDate(election.registrationStartDateTime) ?
                                                            null
                                                            :
                                                            <span style={{ color: "red" }} name={election.electionAddress}>
                                                                <p>No candidates accepted yet...</p>
                                                            </span>
                                                    }

                                                    {
                                                        checkDate(election.registrationEndDateTime) ?
                                                            <span>
                                                                {
                                                                    checkRegStartDate(election.registrationStartDateTime) ?
                                                                        null
                                                                        :
                                                                        <span>
                                                                            {
                                                                                checkRegistered(election.electionAddress) ?
                                                                                    <span style={{ fontSize: "15px", paddingBottom: "11px", paddingTop: "10px", backgroundColor: "white", color: "green", border: "1px solid green" }} className="badge">Already Applied</span>
                                                                                    :
                                                                                    <Button onClick={() => { candidateRegister(election) }} className="btn btn-info">Apply as Candidate</Button>
                                                                            }
                                                                        </span>
                                                                }
                                                                {
                                                                    checkRegStartDate(election.registrationStartDateTime) ?
                                                                        null
                                                                        :
                                                                        <Button onClick={() => { viewCandidateList(election.electionAddress) }} className="btn btn-warning" style={{ marginLeft: "5px" }}><span name={election.electionAddress}>Show Candidate List</span></Button>
                                                                }
                                                            </span>
                                                            :
                                                            <span>
                                                                {
                                                                    checkRegStartDate(election.registrationStartDateTime) ?
                                                                        null
                                                                        :
                                                                        <Button onClick={() => { viewCandidateList(election.electionAddress) }} className="btn btn-warning" style={{ marginLeft: "5px" }}><span name={election.electionAddress}>Show Candidate List</span></Button>
                                                                }
                                                            </span>
                                                    }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            }
                        </Grid>
                        :
                        null
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
        </Delayed >
    );
}

export default UpcomingElectionsVoter;