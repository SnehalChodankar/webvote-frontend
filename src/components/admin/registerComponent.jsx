import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import logo from '../../images/webvotelogo.png';

import axios from 'axios';

import Delayed from '../common/delayed';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField, Button, FormControl, InputLabel, Input, InputAdornment, IconButton, Select, MenuItem } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

require('dotenv').config();

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        minWidth: 300,
    },
}));

/*
------------------------------------Register Component for Admin-----------------------------------------------------
This component is used to diaplay a form to register admins which can be only accessed by other logged in admin.

Function to register admin:
- register():
    :- Sends axios request to the server,js file on path "/admin/register" to register the candiadate.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.
-------------------------------------------------------------------------------------------------------------
*/

function AdminRegister() {
    const classes = useStyles();
    //-----------------------------------Section Start: Variables & State Variables----------------------------------------------
    let history = useHistory();

    const paperStyle = { padding: 20, width: 400 }
    const btnstyle = { margin: "40px 0 20px 0" }

    const [data, setData] = useState(null);
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerCollege, setRegisterCollege] = useState("");
    //-----------------------------------Section Ended: Variables & State Variables----------------------------------------------

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //--------------------------------Section Start: Function to register admin---------------------------------

    /**
     * Admin registration
     */
    const register = () => {
        axios({
            method: "POST",
            data: {
                fullname: registerName,
                username: registerUsername,
                password: registerPassword,
                college: registerCollege,
                isAdmin: true
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/admin/register',
        })
            .then(res => {
                history.push('/admin/login');
            });
    }
    //--------------------------------Section Ended: Function to register admin---------------------------------

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
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    return (
        <Delayed waitBeforeShow={500}>
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
                                The Ballot is stronger than the Bullet.
                                <br />
                                <i style={{ fontWeight: "100" }}>~Abraham Lincoln</i>
                            </p>
                        </Col>
                        <Col style={{ marginTop: "50px" }} className="offset-1 align-self-center">
                            <Grid>
                                <Paper elevation="10" style={paperStyle}>
                                    <h3>Admin Register</h3>
                                    <TextField label='Full Name' placeholder="Enter Full Name" onChange={event => setRegisterName(event.target.value)} fullWidth required />

                                    <TextField inputProps={{ maxLength: 15 }} label='Username' style={{ marginTop: "20px" }} placeholder="Enter Username (Max 15 letters)" onChange={event => setRegisterUsername(event.target.value)} fullWidth required />

                                    <FormControl className={classes.formControl} fullWidth style={{ marginTop: "20px", marginRight: "20px", textAlign: "left" }}>
                                        <InputLabel id="collegeLabel">College</InputLabel>
                                        <Select labelId="collegeLabel" id="registerCollege" name="registerCollege" value={registerCollege} onChange={event => setRegisterCollege(event.target.value)} >
                                            <MenuItem value="Goa College of Engineering">Goa College of Engineering</MenuItem>
                                            <MenuItem value="Agnel Institute of Technology and Design">Agnel Institute of Technology and Design</MenuItem>
                                            <MenuItem value="Padre Conceicao College of Engineering">Padre Conceicao College of Engineering</MenuItem>
                                            <MenuItem value="Shree Rayeshwar Institute of Engineering and Information Technology">Shree Rayeshwar Institute of Engineering and Information Technology</MenuItem>
                                            <MenuItem value="Don Bosco College of Engineering">Don Bosco College of Engineering</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth style={{ marginRight: "20px", marginTop: "20px" }}>
                                        <InputLabel htmlFor="standard-adornment-password">Password *</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            type={value.showPassword ? 'text' : 'password'}
                                            name="password"
                                            onChange={event => setRegisterPassword(event.target.value)}

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

                                    <Button type="submit" onClick={register} style={btnstyle} color="primary" variant="contained" fullWidth>Register</Button>
                                </Paper>
                            </Grid>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Delayed>
    );
}

export default AdminRegister;