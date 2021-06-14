import { React, useState } from 'react';
import NavbarWVLogin from '../navbar/navbarComponentLogin';
import FooterWV from './footerComponent';
import { Grid, Paper, Button, TextField } from '@material-ui/core';
import emailjs from 'emailjs-com';

require('dotenv').config();

/*
---------------------------------------------Contact Us---------------------------------------
This component is used to allow any enquiry messages to be sent to project handling people via email.

Function to send Email:
-sendResponse()
    :- This function sends an email with the detals entered via form by anyone.
----------------------------------------------------------------------------------------------------
*/

function ContactUs() {
    //-----------------------------------Section Start: State Variables----------------------------------------------
    const [fullName, setFullName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    //-----------------------------------Section Ended: State Variables----------------------------------------------

    //-----------------------------------Section Start: Function to send Email----------------------------------------------

    /**
     * Sends email with the form data entered by anyone.
     */
    const sendResponse = () => {
        var templateParams = {
            full_name: fullName,
            from_email: emailID,
            subject: subject,
            message: message,
        };
        //console.log(OTP);
        emailjs.send(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, templateParams, process.env.REACT_APP_EMAILJS_USERID)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert("Response sent!");
                window.location.reload(false);
            }, function (error) {
                console.log('FAILED...', error);
            });
    }
    //-----------------------------------Section Ended: Function to send Email----------------------------------------------

    return (
        <div>
            <NavbarWVLogin />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Grid>
                    <Paper elevation="10" style={{ width: "1000px", marginTop: "30px", paddingBottom: "30px" }}>
                        <div style={{ paddingTop: "20px" }}>
                            <div style={{ textAlign: "left", paddingLeft: "50px", paddingBottom: "10px" }}>
                                <h3>Feel free to contact us...</h3>
                            </div>
                            <TextField
                                label="Full Name"
                                value={fullName}
                                onChange={event => setFullName(event.target.value)}
                                variant="filled"
                                style={{ width: "44%", marginRight: "35px" }}
                            />
                            <TextField
                                label="Email ID"
                                variant="filled"
                                value={emailID}
                                onChange={event => setEmailID(event.target.value)}
                                style={{ width: "43%" }}
                            />
                            <br /><br />
                            <TextField
                                label="Subject of Message"
                                variant="filled"
                                value={subject}
                                onChange={event => setSubject(event.target.value)}
                                style={{ width: "90%" }}
                            />
                            <br /><br />
                            <TextField
                                label="Message"
                                variant="filled"
                                multiline
                                rows={5}
                                value={message}
                                onChange={event => setMessage(event.target.value)}
                                style={{ width: "90%" }}
                            /><br /><br />
                            <Button variant="contained" style={{ backgroundColor: "#15784E", color: "white" }} onClick={() => { sendResponse() }}>
                                Submit
                            </Button>
                        </div>
                    </Paper>
                </Grid>
            </div>
            <br /><br /><br />
            <FooterWV />
        </div>
    );
}

export default ContactUs