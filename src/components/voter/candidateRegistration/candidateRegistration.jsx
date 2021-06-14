import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Delayed from '../../common/delayed';
import FooterWV from '../../common/footerComponent';

import VoterNavbar from '../../navbar/voterNavbar';

import axios from 'axios';

import { Grid, Paper, TextField, Button, FormControl, InputLabel, Input, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

require('dotenv').config();

/* 
------------------------------Candidate Registration Component-------------------------------------------------
This page takes the candidate request from voter and stores them in candidateRequests schema. It also diplayes 
the details of the election for which user is applying for.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Candidate Registration:
    :- First password is compared and if its true, then the axios request is sent to server.js on the path 
       "/registerCandidateRequest" and then redirect it to the upcoming elections. 

---------------------------------------------------------------------------------------------------------------
*/

const bcrypt = require('bcryptjs');

function CandidateRegForm() {
    let history = useHistory();
    let location = useLocation();

    //--------------------------------Section Start: Styles----------------------------------------------------
    const paperStyle = { padding: 20, width: 600, marginLeft: "46%", marginTop: "30px" }
    const btnstyle = { margin: "40px 0 20px 0" }
    //--------------------------------Section Ended: Styles----------------------------------------------------

    //--------------------------------Section Start: State Variables-------------------------------------------
    const [data, setData] = useState(null);
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    //---------------------------------Section Ended: State Variables-------------------------------------------

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
                setFullname(res.data.firstname + " " + res.data.middlename + " " + res.data.lastname);
                if (res.data.prNumber == null) {
                    history.push('/');
                }
            });
    }

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //----------------------------------Section Start: Candidate Registration------------------------------------

    /**
     * Register a new candidate in database.
     */
    const registerCandidate = () => {
        bcrypt.compare(password, data.password, (err, res) => {
            if (res) {
                axios({
                    method: "POST",
                    data: {
                        electionAddress: location.state.electionAddress,
                        candidateName: fullname,
                        prNumber: data.prNumber,
                        college: data.college,
                        department: data.department,
                        description: description,
                        gender: data.gender,
                        status: "pending"
                    },
                    withCredentials: true,
                    url: process.env.REACT_APP_BACKEND_ORIGIN+'/registerCandidateRequest',
                })
                    .then(res => {
                        alert(res.data);
                        history.push("/voter/upcoming");
                    })
            }
            else {
                alert("Incorrect Password");
            }
        });
    }
    //----------------------------------Section Ended: Candidate Registration------------------------------------

    /**
     * Convert date and time to string format.
     * @param {date} _date date and time to be converted.
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
                    <VoterNavbar data={data} />
                    : null
            }

            <div>
                {data ?
                    <span>
                        <Grid style={{ position: "absolute" }}>
                            <Paper elevation="10" style={{ width: "400px", marginLeft: "120px", paddingBottom: "30px" }}>
                                <h3 style={{ padding: "10px" }}>Election Details</h3>

                                <TextField label="Election Title" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.type} />
                                <br />
                                <TextField label="College" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.college} />
                                <br />
                                <TextField label='Registration Ends On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.registrationEndDateTime)} /><br />
                            </Paper>
                        </Grid>

                        <Grid style={{ position: "absolute", marginTop: "320px" }}>
                            <Paper elevation="10" style={{ width: "400px", marginLeft: "120px" }}>
                                <p style={{ padding: "20px", color: "red" }}>
                                    <strong>Note:</strong><br />
                                    <i>You can apply only once per election.<br />If the application is rejected you won't get another chance to apply again.</i>
                                </p>
                            </Paper>
                        </Grid>

                        <Grid>
                            <Paper elevation="10" style={paperStyle}>
                                <h3>Candidate Registration Form</h3>

                                <TextField label="Full name" style={{ marginTop: "20px", marginRight: "30px" }} disabled value={data.firstname + " " + data.middlename + " " + data.lastname} />
                                <TextField label="Department" style={{ marginTop: "20px" }} disabled value={data.department} />
                                <br />
                                <TextField label='College' style={{ marginTop: "20px", width: "420px" }} disabled value={data.college} /><br />
                                <span style={{ color: "red" }}>Please make sure the election for which you are applying is of same college in which you study, Otherwise application might get rejected!!!</span>
                                <br />
                                <TextField onChange={event => setDescription(event.target.value)} label='Additional Description about Candidate (Optional)' style={{ marginTop: "20px", width: "420px" }} />
                                <br />

                                <FormControl style={{ width: 200, marginRight: "20px", marginTop: "20px" }}>
                                    <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type={value.showPassword ? 'text' : 'password'}
                                        name="password"
                                        onChange={event => setPassword(event.target.value)}

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

                                <Button type="submit" onClick={registerCandidate} style={btnstyle} color="secondary" variant="contained" fullWidth>Apply</Button>
                            </Paper>
                        </Grid>
                        <br /><br />
                    </span>
                    : null}
            </div>
            <br />
            <FooterWV />
        </Delayed>
    );
}

export default CandidateRegForm;