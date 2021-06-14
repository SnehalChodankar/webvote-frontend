import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import NavbarWV from './navbar/navbarComponent';
import Home from './common/homeComponent';
import FooterWV from './common/footerComponent';
import HowTo from './common/howToComponent';

import Register from './voter/registration/registerComponent';
import CurrentElectionsVoter from './voter/currentElections';
import UpcomingElectionsVoter from './voter/upcomingElections';
import ResultsVoter from './voter/resultsComponent';
import CandidateRegForm from './voter/candidateRegistration/candidateRegistration';
import Vote from './voter/voteComponent';
import StatisticsVoter from './voter/statisticsComponent';
import DetailedResultVoter from './voter/detailedResult';

import AdminLogin from './admin/loginComponent';
import AdminHome from './admin/homeComponent';
import AdminRegister from './admin/registerComponent';
import ElectionForm from './admin/newElectionForm';
import AdminUpcomingElections from './admin/upcomingElections';
import AdminResults from './admin/resultsComponent';
import CandidateRequests from './admin/candidateRequests';
import StatisticsAdmin from './admin/statisticsComponent';
import DetailedResultAdmin from './admin/detailedResult';
import AboutUs from './common/aboutUsComponent';
import ContactUs from './common/contactUsComponent';

require('dotenv').config();

/*
----------------------------------------------Main Component-----------------------------------
This component is used to set all the routes around the app. Also it handles the state change
of elections based on time, everytime new route is accessed.

Functions used to check Election State Change:
- getElectionsList()
    :- Sends axios request to server.js file on route '/getAllElections' to get all the elections
       present in the database.
       Once elections are received, checkElections is called passing elections received as parameter.
- checkElections(elections)
    :- This function runs a for loop over elections to access one election details at a time.
       Further, inside loop, it checks for voting start and end dates using checkElectionStartedEnded
       and makes a call to updateElectiontoDB based on the results received after checking dates.
- updateElectiontoDB(electionAddr, state)
    :- Sends axios request to server.js file on route '/updateElection' to update the election state.
- checkElectionStartedEnded(_dateTime)
    :- Checks the passed _dataTime with the current time and returns true if current date is greater 
       than the _dateTime othewise false.

Routes: - Common Routes
        - Voter Routes
        - Admin Routes
-----------------------------------------------------------------------------------------------
*/

function Main() {

    //------------------------Section Start: Functions for Election State Change--------------------------

    /**
     * Get all elections from database.
     */
    const getElectionsList = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getAllElections',
        })
            .then(res => {
                checkElections(res.data);
            });
    }

    /**
     * Update Election state in database.
     * @param {string} electionAddr hexadecimal value
     * @param {string} state registration, voting, results
     */
    const updateElectiontoDB = (electionAddr, state) => {
        axios({
            method: "POST",
            data: {
                electionAddress: electionAddr,
                status: state
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/updateElection',
        })
            .then(res => {
                console.log(res.data);
            });
    }

    /**
     * Check elections for state change.
     * @param {JSON} elections json objects
     */
    const checkElections = (elections) => {
        for (let key in elections) {
            var votingStartDate = elections[key].votingStartDateTime;
            var addr = elections[key].electionAddress;
            var check = checkElectionStartedEnded(votingStartDate);

            //election is started
            if (check) {
                //check if election is ended
                var checkEnd = checkElectionStartedEnded(elections[key].votingEndDateTime);

                if (checkEnd) {
                    if (elections[key].state === "voting")
                        updateElectiontoDB(addr, "results");
                }
                if (elections[key].state === "registration")
                    updateElectiontoDB(addr, "voting");
            }
        }
    }

    /**
     * Check if election is started or ended.
     * @param {date} _dateTime date and time to check
     * @returns {boolean} true if election is started/ ended otherwise false
     */
    const checkElectionStartedEnded = (_dateTime) => {
        var current = new Date();
        var voteDate = new Date(_dateTime);

        if (current > voteDate) {
            return true;
        } else {
            return false;
        }
    }

    //---------------------Section Ended: Functions for Election State Change--------------------------

    return (
        <div>
            <Router>
                <Switch>

                    {/* ----------------------------Common Routes---------------------------- */}

                    <Route exact path="/">
                        <NavbarWV />
                        <Home />
                        <FooterWV />
                    </Route>

                    <Route
                        path="/howto"
                        render={() => {
                            getElectionsList();
                            return <HowTo />;
                        }}
                    />

                    <Route
                        path="/aboutus"
                        render={() => {
                            getElectionsList();
                            return <AboutUs />;
                        }}
                    />

                    <Route
                        path="/contactus"
                        render={() => {
                            getElectionsList();
                            return <ContactUs />;
                        }}
                    />

                    <Route
                        path="/register"
                        render={() => {
                            getElectionsList();
                            return <Register />;
                        }}
                    />

                    {/* ----------------------------Voter Routes---------------------------- */}

                    <Route
                        exact
                        path="/voter/home"
                        render={() => {
                            getElectionsList();
                            return <CurrentElectionsVoter />;
                        }}
                    />

                    <Route
                        exact
                        path="/voter/upcoming"
                        render={() => {
                            getElectionsList();
                            return <UpcomingElectionsVoter />;
                        }}
                    />

                    <Route
                        exact
                        path="/voter/results"
                        render={() => {
                            getElectionsList();
                            return <ResultsVoter />;
                        }}
                    />

                    <Route
                        exact
                        path="/voter/upcoming/newCandidate"
                        render={() => {
                            getElectionsList();
                            return <CandidateRegForm />;
                        }}
                    />

                    <Route
                        exact
                        path="/voter/home/vote"
                        render={() => {
                            getElectionsList();
                            return <Vote />
                        }}
                    />

                    <Route
                        exact
                        path="/voter/home/statistics"
                        render={() => {
                            getElectionsList();
                            return <StatisticsVoter />
                        }}
                    />

                    <Route
                        exact
                        path="/voter/results/detailedResult"
                        render={() => {
                            getElectionsList();
                            return <DetailedResultVoter />
                        }}
                    />

                    {/* ----------------------------Admin Routes---------------------------- */}

                    <Route
                        exact
                        path="/admin/login"
                        render={() => {
                            getElectionsList();
                            return <AdminLogin />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/home"
                        render={() => {
                            getElectionsList();
                            return <AdminHome />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/upcoming"
                        render={() => {
                            getElectionsList();
                            return <AdminUpcomingElections />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/results"
                        render={() => {
                            getElectionsList();
                            return <AdminResults />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/register"
                        render={() => {
                            getElectionsList();
                            return <AdminRegister />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/newElection"
                        render={() => {
                            getElectionsList();
                            return <ElectionForm />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/upcoming/candidateRequests"
                        render={() => {
                            getElectionsList();
                            return <CandidateRequests />;
                        }}
                    />

                    <Route
                        exact
                        path="/admin/home/statistics"
                        render={() => {
                            getElectionsList();
                            return <StatisticsAdmin />
                        }}
                    />

                    <Route
                        exact
                        path="/admin/results/detailedResult"
                        render={() => {
                            getElectionsList();
                            return <DetailedResultAdmin />
                        }}
                    />
                </Switch>
            </Router>
        </div>

    );
}

export default Main;