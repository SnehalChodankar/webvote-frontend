import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import axios from 'axios';

import logo from '../../images/webvotelogo.png';

import { Grid, Paper, TextField, Button, FormControl, InputLabel, Input, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

require('dotenv').config();

/* 
-------------------------------------Admin Login Component--------------------------------------------------------
This component is a login form for admin.

Admin Login Function
login():
    :- This send the axios request to server.js on path /login. Once request is verified the user is logged in.
---------------------------------------------------------------------------------------------------------------
*/

function AdminLogin() {
    //-------------------------------Section Start: Variables and States---------------------------------------
    let history = useHistory();

    const paperStyle = { padding: 20, width: 350 }
    const btnstyle = { margin: "40px 0 20px 0" }

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    //-------------------------------Section Ended: Variables and States---------------------------------------

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //-------------------------------Section Start: Admin Login Function---------------------------------------

    /**
     * Start the admin session.
     */
    const login = () => {
        axios({
            method: "POST",
            data: {
                username: loginUsername,     //<--state values
                password: loginPassword,
                isAdmin: true
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/admin/login'
        })
            .then(res => {
                history.push('/admin/home');
            });
    };
    //-------------------------------Section Ended: Admin Login Function---------------------------------------

    return (
        <div style={{ backgroundColor: "white" }}>
            <Container>
                <Row>
                    <Col>
                        <img src={logo} alt="Logo" width="300" height="300" style={{ marginTop: "100px" }} /><br />
                        <h1 class="display-4" style={{ fontWeight: "bold" }}>
                            <span style={{ color: "#2F4C58" }}>Web</span>
                            <span style={{ color: "#4999B8" }}>Vote</span>
                        </h1>
                        <p class="lead" style={{ fontWeight: "600" }}>
                            The Ballot is stronger than the Bullet.<br />
                            <i style={{ fontWeight: "100" }}>~Abraham Lincoln</i>
                        </p>
                    </Col>

                    <Col className="offset-2 align-self-center">
                        <Grid>
                            <Paper elevation="10" style={paperStyle}>
                                <h3>Admin Login</h3>

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

                                <Button type="submit" onClick={login} style={btnstyle} color="primary" variant="contained" fullWidth>Login</Button>
                                <Button hidden href="/admin/register" color="secondary" variant="contained" fullWidth>Register</Button>
                            </Paper>
                        </Grid>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminLogin;