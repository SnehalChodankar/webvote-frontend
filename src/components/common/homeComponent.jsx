import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HashLoader } from 'react-spinners'
import { Container, Row, Col } from 'react-bootstrap';

import axios from 'axios';

import logo from '../../images/webvotelogo.png';

import { Grid, Paper, TextField, Button, FormControl, Input, InputLabel, InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

require('dotenv').config();

/*
----------------------------------------------Home Component---------------------------------------------------
This is used for voter login. Also it handles the state change of elections based on time, 
everytime new route is accessed.

Functions for OTP and Login:
- generateOtp()
    :- This will generate a random 4 digit OTP using Math.floor() and Math.random(). Further this OTP is 
       used as a parameter to getUser().
- getUser(otp)
    :- This sends axios request to the server.js on path "/getEmail". And then calls sendOtp().
- sendOtp(otp, mobile)
    :- This sends the axios request to the server.js on path "/sendOTP".
- verifyOtp()
    :- Validates the OTP generated and OTP enetered in textfield using localeCompare(OTP).
       ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
       On successfull validation login() function is called.
- login()
    :- This send the axios request to server.js on path /login. Once request is verified the user is logged in.

Functions used to check Election State Change:
- getElections()
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

--------------------------------------------------------------------------------------------------------------- 
*/

function Home() {
    let history = useHistory();

    //-----------------------------------Section Start: Variables----------------------------------------------
    let otp = "";
    //-----------------------------------Section Ended: Variables----------------------------------------------

    //----------------------------Section Start: States and Functions of password field------------------------------------

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //----------------------------Section Ended: States and Functions of password field------------------------------------

    //-----------------------------Section Start: Styles---------------------------------------------------------
    const paperStyle = { padding: 20, width: 350 }
    const btnstyle = { margin: "40px 0 20px 0" }
    //------------------------------Section Ended: Styles-------------------------------------------------------

    //------------------------------Section Start: State Variables-----------------------------------------------
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginOtp, setLoginOtp] = useState("");
    const [OTP, setOTP] = useState("");
    //------------------------------Section Ended: State Variables-----------------------------------------------

    //------------------------------Section Start: Functions for OTP and Login---------------------------------------------

    /**
     * Generates OTP for validation
     */
    const generateOtp = () => {
        if (loginUsername !== "") {
            document.getElementById("loader").removeAttribute("hidden");
            let num = "1234567890"

            for (let i = 0; i < 4; i++) {
                otp += num[Math.floor(Math.random() * 10)];
            }
            setOTP(otp);
            getUser(otp);
        }
        else {
            alert("Please enter a username first!!!");
        }
    }

    /**
     * Get mobile number to send OTP
     * @param {number} otp OTP
     */
    const getUser = (otp) => {
        axios({
            method: "POST",
            data: {
                username: loginUsername,     //<--state values
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getEmail',
        })
            .then(res => {
                sendOtp(otp, res.data.mobile);
            });
    }

    /**
     * Send OTP via f2s to voter's mobile number.
     * @param {number} otp OTP
     * @param {number} mobile voter's mobile number
     */
    const sendOtp = (otp, mobile) => {
        axios({
            method: "POST",
            data: {
                message: otp,
                number: mobile
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/sendOTP',
        })
            .then(res => {
                alert('OTP has been sent to Mobile No.: ' + mobile);
                document.getElementById("loader").setAttribute("hidden", true);
            });
    }

    /**
     * Verify entered OTP with generated one.
     */
    const verifyOtp = () => {
        if (loginOtp === "")
            alert('Please enter the otp received in mobile no.');
        else if (loginOtp.localeCompare(OTP) === 0) {
            login();
        }
        else if (loginOtp !== OTP) {
            alert('Invalid OTP!!!');
        }
    };

    /**
     * Start the session for voter.
     */
    const login = () => {
        axios({
            method: "POST",
            data: {
                username: loginUsername,     //<--state values
                password: loginPassword
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/login',
        })
            .then(res => {
                console.log(res);
                if (res.data === "No User Exists or Invalid Credentials Entered!!!")
                    alert(res.data);
                history.push('/voter/home');
            });
    };

    //------------------------------------Section Ended: Functions for OTP and Login---------------------------------------------

    //-----------------------------------Section Start: Functions for Election State Change--------------------------

    /**
     * Fetch all elections in registration state.
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
                checkElections(res.data);
            });
    }

    /**
     * Update election status.
     * @param {string} electionAddr hex election address
     * @param {string} state registration, voting, results.
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
     * Check the time and update the status respectively.
     * @param {JSON} elections json election objects.
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
     * Checks if election started/ ended
     * @param {date} _dateTime date to compare
     * @returns {boolean} true if started/ ended.
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

    //-----------------------------------Section Ended: Functions for Election State Change--------------------------
    return (
        <Container onLoad={getElections}>
            <Row>
                <Col>
                    <img src={logo} alt="Logo" width="350" height="350" style={{ marginTop: "50px" }} />
                    <h1 class="display-4" style={{ fontWeight: "bold" }}>
                        <span style={{ color: "#2F4C58" }}>Web</span>
                        <span style={{ color: "#4999B8" }}>Vote</span>
                    </h1>
                    <p class="lead" style={{ fontWeight: "600" }}>
                        The Ballot is stronger than the Bullet.
                        <br />
                        <i style={{ fontWeight: "100" }}>~Abraham Lincoln</i>
                    </p>
                </Col>

                <Col className="offset-2 align-self-center">
                    <Grid>
                        <Paper elevation="10" style={paperStyle}>
                            <h3>Login</h3>

                            <TextField label='Username' placeholder="Enter Username" onChange={event => setLoginUsername(event.target.value)} fullWidth required />

                            <FormControl style={{ width: 310, marginRight: "20px", marginTop: "20px" }}>
                                <InputLabel htmlFor="standard-adornment-password">Password *</InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={value.showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={event => setLoginPassword(event.target.value)}

                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {value.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <span hidden id="loader" style={{ display: "flex", position: "absolute", marginLeft: "275px", marginTop: "37px" }}>
                                <HashLoader color="blue" size={20} loading />
                            </span>

                            <TextField label='OTP' style={{ margin: "20px 10px 0 0", width: "60px" }} onChange={event => setLoginOtp(event.target.value)} required />

                            <Button type="number" onClick={generateOtp} style={{ backgroundColor: "lightskyblue", marginTop: "30px" }} variant="contained" >Generate OTP</Button>

                            <Button type="submit" onClick={verifyOtp} style={btnstyle} color="primary" variant="contained" fullWidth><span className="fas fa-sign-in-alt"></span> &nbsp;Login</Button>
                        </Paper>
                    </Grid>

                </Col>
            </Row>
        </Container>
    );
}

export default Home;