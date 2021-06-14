import React from 'react';
import { Navbar, Nav, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import logo from '../../../../images/webvotelogo.png';

import FooterWV from '../../../common/footerComponent';

import Web3 from 'web3';

import { Container, Accordion, AccordionSummary, AccordionDetails, ListItemText, Button, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

var Tx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

/* 
--------------------------------------------Summary Page-----------------------------------------------------------
This page displays the summary of details entered by user and stores them in the database once submitted.

Functions to register users and sending ethers to them:
- register()
    :- Calls the sendEthers() which will send ethers to users before registering them.
       Sends axios request to server.js on path "/register", which will store the passed data in database.
- sendEthers(walletAddress)
    :- In here we first convert the sender private key to hex by cancatenating '0x' to it and also
       buffer the privatekey of the sender account using Buffer() function.
       Next we create a web3 instance using infura url, then using the web3 instance, call the 
       signTransaction() function to send the ethers.
       In signTransaction() funtion we specify:
            - the address to send ethers to, 
            - the value(amount) to send, 
            - and the gas required. 
       Now sign this transaction with hex private key of sender. 
       After that in callback function you get the rawTransaction, sign it using sign(privatekey) function
       and serialize the transaction 'tx'. After this you are set to broadcast the transaction onto the network
       using sendSignedTransaction(serializedTransaction) funtion.
       This will give the receipt of the transaction on the blockchain.
----------------------------------------------------------------------------------------------------------------
*/

function Summary({ formData, navigation }) {
    let history = useHistory();

    //-----------------------------------------Section Start: Variables--------------------------------------------

    const { go } = navigation;

    const { firstname, lastname, middlename, gender, dob, mobile, email, college, department, prNumber, rollNumber, year, password, walletAddress, privateKey, isAdmin } = formData;
    //-----------------------------------------Section Ended: Variables--------------------------------------------

    //---------------------Section Start: Functions to register users and sending ethers to them-----------------------------------

    /**
     * Register a new voter in voter schema.
     */
    const register = () => {
        sendEthers(walletAddress);

        axios({
            method: "POST",
            data: {
                firstname: firstname,     //<--state values
                lastname: lastname,
                middlename: middlename,
                gender: gender,
                dob: dob,
                mobile: mobile,
                email: email,
                college: college,
                department: department,
                prNumber: prNumber,
                rollNumber: rollNumber,
                year: year,
                password: password,
                walletAddress: walletAddress,
                privateKey: privateKey,
                isAdmin: isAdmin
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/register',
        })
            .then(res => {
                alert(res.data);
                history.push('/');
            });
    };

    /**
     * Send ethers to mentioned address.
     * @param {string} addr hex address to send ether to.
     */
    const sendEthers = (addr) => {
        var senderAccPrivateKey = '0x' + process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY;
        var senderAccPrivateKeyHex = Buffer.from(process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY, 'hex');

        let web3 = new Web3(process.env.REACT_APP_URL_INFURA);

        web3.eth.accounts.signTransaction({
            to: addr,
            value: '200000000000000000',
            gas: 2000000
        }, senderAccPrivateKey, function (err, res) {
            if (err) { console.log(err) }
            var rawTxn = res.rawTransaction;
            var tx = new Tx(rawTxn, { 'chain': 'ropsten' });
            tx.sign(senderAccPrivateKeyHex);

            var serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .on('receipt', console.log);
        });
    }
    //---------------------Section Ended: Functions to register users and sending ethers to them-----------------------------------

    return (
        <div>
            <div className="shadow">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">
                        <img src={logo} width="40" style={{ marginRight: "10px", marginLeft: "10px" }} alt="WebVote Logo" />
                        <label style={{ color: "#15784E", fontWeight: "bold", fontSize: "xx-large" }}>
                            <span style={{ color: "#2F4C58" }}>Web</span>
                            <span style={{ color: "#4999B8" }}>Vote</span>
                        </label>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto navlinks offset-4">
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/howto">How To?</Nav.Link>
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/aboutus">About Us</Nav.Link>
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/contactus">Contact Us</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            <Container maxWidth="md" style={{ marginTop: "30px", textAlign: "left", marginBottom: "30px" }}>
                <Card style={{ marginBottom: "50px" }}>
                    <Card.Header>
                        <Card.Title>
                            <ul className="progressbar">
                                <li className="active">User Details</li>
                                <li className="active">Credentials</li>
                                <li className="active">Summary</li>
                            </ul>
                        </Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Container maxWidth="sm">
                            <RenderAccordion summary="Personal Details" go={go} details={[
                                { 'First Name': firstname },
                                { 'Middle Name': middlename },
                                { 'Last Name': lastname },
                                { 'Gender': gender },
                                { 'Date of Birth': dob },
                                { 'Mobile': mobile },
                                { 'Email': email },
                                { 'College': college },
                                { 'Department': department },
                                { 'PR No.': prNumber },
                                { 'Roll No.': rollNumber },
                                { 'Year': year }
                            ]} />

                            <RenderAccordion summary="Credentials" go={go} details={[
                                { 'Username': prNumber },
                                { 'Wallet Address': walletAddress }
                            ]} />

                            <Button color="primary" variant="contained" onClick={register} style={{ marginTop: "15px" }}>Submit</Button>
                        </Container>
                    </Card.Body>

                </Card>
            </Container>
            <br />
            <FooterWV />
        </div>
    );
}

export default Summary;

function RenderAccordion({ summary, details, go }) {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h5>{summary}</h5>
            </AccordionSummary>
            <AccordionDetails style={{ textAlign: "left" }}>
                <div>
                    {details.map((data, index) => {
                        const objKey = Object.keys(data)[0];
                        const objValue = data[Object.keys(data)[0]];

                        return <ListItemText key={index}>{`${objKey}: ${objValue}`}</ListItemText>
                    })}
                    <IconButton color="primary" component="span" onClick={() => go(`${summary.toLowerCase().split(' ').filter(s => s).join('')}`)}>
                        <EditIcon></EditIcon>
                    </IconButton>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}