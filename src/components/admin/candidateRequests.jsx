import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { BarLoader, PropagateLoader } from 'react-spinners';

import { Grid, Paper, TextField, Card, CardContent, Typography } from '@material-ui/core';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import LogoutBtn from '../navbar/logoutBtnComponent';

import axios from 'axios';

import logo from '../../images/webvotelogo.png';

import Web3 from 'web3';
import { webvoteABI } from '../../smartContractDetails/abi';

var Tx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

/*
----------------------------------------Candidate Request Component---------------------------------------------
This component displays the candidate requests for particular election and provides options to either accept 
or reject that request. It also displays accepted candidates at side and enables admin to delete the accepted 
candidate.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Functions for Auto Refill wallet
- getAdminBalance()
    :- Function is used to check the balance of the Admin wallet, and if the balance has gone below a certain
       limit of ethers, then this function calls sendEthers() function which executes the transaction.
- sendEthers(addr)
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

Function to getCandidates:
- getCandidates()
    :- Sends axios request to server.js file on path '/getCandidateRequest' to get all the candidate requests
       and then call the getAcceptedCandidates function.
- getAcceptedCandidates()
    :- Sends axios request to server.js file on path '/getAllCandidates' to get all the candidates.

Functions called in HTML:
- checkAddress(electionAddress)
    :- It checks if the election address passed as parameter is same as received from history.push().
       Returns true if address matches otherwise false.
- checkStatus(status)
    :- It checks if the status of candidate request passed as parameter is "pending", if so returns true 
       otherwise false.
- getAcceptedCandidateCount(address)
    :- This function accesses the total candidate count from the smart cantract, which is then displayed to the 
       admin on front end.
- showHideAcceptedCandidateDetails(id)
    :- This function is used to view details of accepted candidates, using a button click.
- convertISOtoLocal(_date)
    :- This function just converts the Date passed in the parameter to human readable format to display it.

Functions to Accept the Candidate Request:
- setId(_candidate)
    :- This function takes candidate as parameter which is to be accepted. 
       First we create a contact instance of our smart contract, and also buffer the admin privatekey.
       Then, call a getTransactionCount() funtion, which will be signed by admin (webVoteAddress), 
       to this function we write a "txObject" in which we pass the "data"
        - data: 
            -> here we call the addCandidate() method of our smart contract, which takes candidate name as 
               parameter and adds it to the candidates mapping (refer the webvote.sol file for smart contract)
        - txObject
            -> to create a txObject we need "nonce", "to" address which is the election address to which we are 
               adding candidates, the "gasLimit", "gasPrice" and "data" created above.
        Next we link the txObject to ropsten chain and sign it with the admin private key and in return we get
        the serialized transaction. This serialized transaction is then converted to hex and then using 
        sendSignedTransaction() it is broadcasted over the blockchain network. And once the receipt is received 
        getID() function is called.
- getID(_candidate)
    :- This method first makes a call to the getter method of totalcand using the contract instance created
       to get the mapping index of candidate added in setId() function and then make another call to getter method 
       of candidates mapping passing the result(latest id) of totalcand() method. After that we send candidate 
       and its newly generated id to the database using sendToDB() method.
- sendToDB(candidate, candidateID)
    :- Sends an axios request to server.js file on "/registerCandidate" path which stores the candidate details 
       in candidates table and calls updateDB() to update status of candidate request.
- UpdateDB(electionAddress, PRNumber, _status)
    :- Sends an axios request to server.js file on "/updateCandidateRequests" path which updates the status of
       candidate request from "pending" to "accepted".

Functions to Reject the Candidate Request:
- rejectRequest(candidate)
    :- Sends an axios request to server.js file on "/updateCandidateRequests" path which updates the status of
       candidate request from "pending" to "rejected".

Functions to Delete the Accepted Candidate:
- removeCandidateFromSmartContract(_candidate)
    :- Works in similar way as setId() to remove an accepted candidate, the only thing changes is the data
        -data:
            -> created by calling the removeCanidate() methid of the smart contract, which takes candidate id
               as parameter.
        Then we call the removeCandidate() method below to delete that candidate from database.
- removeCandidate(candidate)
    :- Sends an axios request to server.js file on "/deleteCandidate" path which deletes the particular 
       candidate from the database.
--------------------------------------------------------------------------------------------------------------- 
*/

function CandidateRequests() {
    //-----------------------------------Section Start: Variables & States----------------------------------------------
    let history = useHistory();
    let location = useLocation();

    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);

    const [data, setData] = useState(null);
    const [candidates, setCandidates] = useState(null);
    const [acceptedCandidates, setAcceptedCandidates] = useState(null);
    const [show, setShow] = useState(false);
    const [noRequests, setNoRequests] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //-----------------------------------Section Ended: Variables & States----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Checks if the user is logged in
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/user'
        })
            .then(res => {
                setData(res.data);
                if (res.data.username == null) {
                    history.push('/admin/login');
                }
                getAdminBalance(process.env.REACT_APP_WEB_VOTE_ADDRESS);
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Functions for Auto Refill wallet-------------------------------

    /**
     * Retreives ether balance of admin account.
     * @param {string} _walletAddress admin wallet address in hex
     */
    const getAdminBalance = (_walletAddress) => {
        web3.eth.getBalance(_walletAddress, (err, res) => {
            if (res <= 100000000000000000) {
                sendEthers(_walletAddress);
            }
        });
    }

    /**
     * Send ethers to admin wallet address.
     * @param {string} addr hex admin wallet address.
     */
    const sendEthers = (addr) => {
        var senderAccPrivateKey = '0x' + process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY;
        var senderAccPrivateKeyHex = Buffer.from(process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY, 'hex');

        web3.eth.accounts.signTransaction({
            to: addr,
            value: '1000000000000000000',
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
    //-------------------------------Section Ended: Functions for Auto Refill wallet-------------------------------

    //-------------------------------Section Start: Functions to getCandidates-------------------------------

    /**
     * Get all the Candidate Requests from database.
     */
    const getCandidates = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/getCandidateRequest',
        })
            .then(res => {
                setCandidates(res.data);
                if (res.data.length !== 0)
                    setNoRequests(true);
                else
                    setNoRequests(false);
                getAcceptedCandidates();
            });
    }

    /**
     * Get all the accepted candidates of a particular election.
     */
    const getAcceptedCandidates = () => {
        axios({
            method: "POST",
            data: {
                electionAddress: location.state.electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/getCandidates',
        })
            .then(res => {
                setAcceptedCandidates(res.data);
            });
    }
    //-------------------------------Section Ended: Functions to getCandidates-------------------------------

    //-------------------------------Section Start: Functions called in HTML----------------------------------

    /**
     * Checks if the passed election address is same as election address received through path.
     * @param {string} electionAddress hex election address.
     * @returns {boolean} true if matches.
     */
    const checkAddress = (electionAddress) => {
        if (electionAddress === location.state.electionAddress) {
            if (document.getElementById("nodata"))
                document.getElementById("nodata").hidden = true;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if the candidate request status is pending
     * @param {string} status candidate request status: pending, accepted, rejected
     * @returns {boolean} true if pending
     */
    const checkStatus = (status) => {
        if (status === 'pending')
            return true;
        else
            return false;
    }

    /**
     * Fetches total candidate count.
     * @param {string} address election address in hex
     */
    const getAcceptedCandidateCount = (address) => {
        const contract = new web3.eth.Contract(webvoteABI, address);

        contract.methods.totalcand().call((error, result) => {
            document.getElementById("totalCandidateCount").innerHTML = result - 1;
        });
    }

    /**
     * Toggles candidate details.
     * @param {string} id candidate id
     */
    const showHideAcceptedCandidateDetails = (id) => {
        if (document.getElementById(id).hidden) {
            document.getElementById(id).removeAttribute("hidden");
            document.getElementsByName(id)[0].innerHTML = "Hide Details";
        }
        else {
            document.getElementById(id).setAttribute("hidden", true);
            document.getElementsByName(id)[0].innerHTML = "Show Details"
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
    //-------------------------------Section Ended: Functions called in HTML----------------------------------

    //-------------------------------Section Start: Functions to Accept the Candidate Request----------------------------------

    /**
     * Registers candidate in smart contract.
     * @param {JSON} _candidate candidate json object
     */
    const setId = (_candidate) => {
        document.getElementsByName(_candidate.candidatePrNumber)[1].removeAttribute("hidden");
        document.getElementsByName(_candidate.candidatePrNumber)[2].removeAttribute("hidden");

        const contract = new web3.eth.Contract(webvoteABI, _candidate.electionAddress);

        const privateKey = Buffer.from(process.env.REACT_APP_WEB_VOTE_PRIVATE_KEY, 'hex');

        web3.eth.getTransactionCount(process.env.REACT_APP_WEB_VOTE_ADDRESS, (error, txCount) => {
            const data = contract.methods.addCandidate(_candidate.candidateName).encodeABI();

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: _candidate.electionAddress,
                gasLimit: web3.utils.toHex(1000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: data
            };

            const tx = new Tx(txObject, { 'chain': 'ropsten' });
            tx.sign(privateKey);

            const serializedTransaction = tx.serialize();
            const raw = '0x' + serializedTransaction.toString('hex');

            web3.eth.sendSignedTransaction(raw).once('receipt', function (receipt) {
                getID(_candidate);
            });
        });
    }

    /**
     * Fetches candidate id of registered candidate from smart contract.
     * @param {JSON} _candidate candidate details
     */
    const getID = (_candidate) => {
        const contract = new web3.eth.Contract(webvoteABI, _candidate.electionAddress);

        contract.methods.totalcand().call((error, result) => {
            contract.methods.candidates(result).call((error, res) => {
                document.getElementById(_candidate.candidatePrNumber).innerHTML = res.candidateID;
                document.getElementsByName(_candidate.candidatePrNumber)[0].setAttribute("disabled", true);
                sendToDB(_candidate, res.candidateID);
            });
        });
    }

    /**
     * Registers candidate into database.
     * @param {JSON} candidate candidate details
     * @param {number} candidateID candidate id
     */
    const sendToDB = (candidate, candidateID) => {
        axios({
            method: "POST",
            data: {
                electionAddress: candidate.electionAddress,
                candidateId: candidateID,
                candidateName: candidate.candidateName,
                candidatePrNumber: candidate.candidatePrNumber,
                gender: candidate.gender,
                college: candidate.college,
                department: candidate.department,
                voteCount: 0,
                description: candidate.description
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/registerCandidate',
        })
            .then(res => {
                updateDB(candidate.electionAddress, candidate.candidatePrNumber, "accepted");
            });
    }

    /**
     * Updates candidate request status to _status.
     * @param {string} electionAddress election address hex
     * @param {number} PRNumber candidate PR number
     * @param {string} _status candidate status
     */
    const updateDB = (electionAddress, PRNumber, _status) => {
        axios({
            method: "POST",
            data: {
                electionAddress: electionAddress,
                candidatePrNumber: PRNumber,
                status: _status
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/updateCandidateRequests',
        })
            .then(res => {
                alert("Candidate Added Successfully!");
                window.location.reload(false);
            });
    }
    //-------------------------------Section Ended: Functions to Accept the Candidate Request----------------------------------

    //-------------------------------Section Start: Functions to Reject the Candidate Request----------------------------------

    /**
     * Update candidate request status to rejected.
     * @param {JSON} candidate candidate details
     */
    const rejectRequest = (candidate) => {
        axios({
            method: "POST",
            data: {
                electionAddress: candidate.electionAddress,
                candidatePrNumber: candidate.candidatePrNumber,
                status: "rejected"
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/updateCandidateRequests',
        })
            .then(res => {
                alert(res.data);
                window.location.reload(false);
            });
    }
    //-------------------------------Section Ended: Functions to Reject the Candidate Request----------------------------------

    //-------------------------------Section Start: Functions to Delete the Accepted Candidate----------------------------------

    /**
     * Delete candidate from smart contract.
     * @param {JSON} _candidate candidate details
     */
    const removeCandidateFromSmartContract = (_candidate) => {
        document.getElementsByName(_candidate.candidateId)[1].removeAttribute("hidden");

        const contract = new web3.eth.Contract(webvoteABI, _candidate.electionAddress);

        const privateKey = Buffer.from(process.env.REACT_APP_WEB_VOTE_PRIVATE_KEY, 'hex');

        web3.eth.getTransactionCount(process.env.REACT_APP_WEB_VOTE_ADDRESS, (error, txCount) => {
            const data = contract.methods.removeCandidate(_candidate.candidateId).encodeABI();

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: _candidate.electionAddress,
                gasLimit: web3.utils.toHex(1000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: data
            };

            const tx = new Tx(txObject, { 'chain': 'ropsten' });
            tx.sign(privateKey);

            const serializedTransaction = tx.serialize();
            const raw = '0x' + serializedTransaction.toString('hex');

            web3.eth.sendSignedTransaction(raw).once('receipt', function (receipt) {
                removeCandidate(_candidate);
            });
        });
    }

    /**
     * Delete candidate from database.
     * @param {JSON} candidate candidate details
     */
    const removeCandidate = (candidate) => {
        axios({
            method: "DELETE",
            data: {
                electionAddress: candidate.electionAddress,
                candidateId: candidate.candidateId
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/deleteCandidate',
        })
            .then(res => {
                document.getElementsByName(candidate.candidateId)[1].hidden = true;
                alert(res.data);
                window.location.reload(false);
            });
    }
    //-------------------------------Section Endeds: Functions to Delete the Accepted Candidate----------------------------------

    return (
        <Delayed waitBeforeShow={500}>

            <div onLoad={getCandidates} className="shadow">
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
                        <Nav className="mr-auto navlinks" style={{ marginLeft: "20px" }}>
                            <Nav.Link style={{ color: "#15784E", marginRight: "10px" }} href="/admin/home">Live Elections</Nav.Link>
                            <Nav.Link href="/admin/upcoming" style={{ color: "#15784E", marginRight: "10px", textDecoration: "underline" }}>Upcoming Elections</Nav.Link>
                            <Nav.Link style={{ color: "#15784E", marginRight: "10px" }} href="/admin/results">Results</Nav.Link>
                        </Nav>
                        <span className="divider-vertical"></span>

                        <Nav>
                            <Button variant="outline-success" href="/admin/newElection" style={{ marginRight: "10px", marginLeft: "10px" }}>Create New Election</Button>
                            <Button variant="outline-success" href="/admin/register">Register Admin</Button>
                        </Nav>

                        <Nav style={{ marginLeft: "5%" }}>
                            {
                                data ?
                                    <div style={{ color: "#15784E", fontSize: "18px" }}>
                                        <span style={{ marginRight: "5px", marginTop: "10px" }} className="fa fa-user"></span>
                                        <span style={{ marginRight: "10px" }}>{data.username}</span>
                                    </div>
                                    : null
                            }

                            <LogoutBtn />
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <br />

            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>How to Add/ Remove Candidates</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Adding Candidates:</h6>
                        <p>Click on the <span style={{ backgroundColor: "limegreen", padding: "5px 10px", borderRadius: "5px", color: "white" }}>Set Id & Accept</span> button below, which will generate an Id which we get after adding the candidate to blockchain. And further, this entry is register into the database.</p>

                        <h6>Removing Candidates:</h6>
                        <p>Click on <span style={{ backgroundColor: "red", padding: "5px 10px", borderRadius: "5px", color: "white" }}>Remove Candidate</span> button which will remove the previously added candidate both from the database and blockchain.</p>

                        <h6>Rejecting Applications:</h6>
                        <p>Click on <span style={{ backgroundColor: "red", padding: "5px 10px", borderRadius: "5px", color: "white" }}>Reject</span> Button which removes the candidate request.</p>
                    </Modal.Body>
                </Modal>
            </>

            <div >
                {
                    data ?
                        <span>
                            <Grid style={{ position: "absolute" }}>
                                <Paper elevation="10" style={{ width: "400px", marginLeft: "80px", paddingBottom: "30px", marginTop: "25px" }}>
                                    <h3 style={{ padding: "10px" }}>Election Details</h3>
                                    <TextField multiline label="Election Title" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.type} />
                                    <br />
                                    <TextField multiline label="College" style={{ marginTop: "20px", width: "300px" }} disabled value={location.state.college} />
                                    <br />
                                    <TextField label='Registration Ends On' style={{ marginTop: "20px", width: "300px" }} disabled value={convertISOtoLocal(location.state.registrationEndDateTime)} />
                                    <br />
                                </Paper>
                            </Grid>
                            <br />

                            <Grid style={{ marginTop: "300px", position: "absolute" }}>
                                <Paper elevation="10" style={{ width: "400px", marginLeft: "80px", paddingBottom: "30px", marginTop: "25px" }}>
                                    <h3 style={{ padding: "10px" }}>Accepted Candidates</h3>
                                    <h6>Total Candidates: <span id="totalCandidateCount"></span></h6>
                                    <hr></hr>
                                    {
                                        acceptedCandidates ?
                                            <span onLoad={getAcceptedCandidateCount(location.state.electionAddress)}>
                                                {
                                                    acceptedCandidates.map((candidate) =>
                                                        <>
                                                            <p style={{ paddingLeft: "30px", textAlign: "left" }}>
                                                                <b>ID: </b> {candidate.candidateId} <br />
                                                                <b>Name: </b> {candidate.candidateName}<br />
                                                                <span hidden id={candidate.candidateId}>
                                                                    <b>PR Number: </b> {candidate.candidatePrNumber} <br />
                                                                    <b>Gender: </b> {candidate.gender}<br />
                                                                    <b>College: </b> {candidate.college} <br />
                                                                    <b>Department: </b> {candidate.department}<br />
                                                                    <b>Description: </b> {candidate.description} <br />
                                                                </span>
                                                            </p>

                                                            <Button onClick={() => { showHideAcceptedCandidateDetails(candidate.candidateId) }}>
                                                                <span name={candidate.candidateId}>Show Details</span>
                                                            </Button>

                                                            <Button onClick={() => { removeCandidateFromSmartContract(candidate) }} style={{ marginLeft: "10px" }} className="btn btn-danger">Remove Candidate</Button>
                                                            <span hidden name={candidate.candidateId}>
                                                                <br /><br />
                                                                <PropagateLoader loading size={10} color="red" />
                                                                <br />
                                                            </span>
                                                            <hr></hr>
                                                        </>
                                                    )
                                                }
                                            </span>
                                            :
                                            null
                                    }
                                </Paper>
                            </Grid>

                            <Grid style={{ marginLeft: "450px" }}>
                                <Paper elevation="10" style={{ width: "750px", marginLeft: "80px", paddingBottom: "30px" }}>
                                    <h3 style={{ padding: "10px" }}>
                                        Candidate Requests
                                        <Button onClick={handleShow} style={{ position: "absolute", fontSize: "12px", marginLeft: "130px", backgroundColor: "transparent", border: "none", color: "limegreen" }}>
                                            <span className="fa fa-info-circle"></span> How it Works?
                                        </Button>
                                    </h3>
                                    {
                                        candidates ?
                                            <>
                                                {
                                                    noRequests ?
                                                        <div id="nodata" style={{ maxHeight: "800px", alignContent: "center", paddingTop: "115px", paddingBottom: "135px" }}>
                                                            <i class="fas fa-cubes fa-5x"></i>
                                                            <p style={{ fontSize: "20px" }}>
                                                                No Candidate Requests!
                                                            </p>
                                                        </div>
                                                        : null
                                                }
                                                <span>
                                                    {
                                                        candidates.map((candidate) =>
                                                            <span>
                                                                {
                                                                    checkStatus(candidate.status) ?
                                                                        <Grid>
                                                                            {
                                                                                checkAddress(candidate.electionAddress) ?
                                                                                    <Card elevation="5" style={{ margin: "20px" }}>
                                                                                        <CardContent style={{ fontSize: "18px" }}>
                                                                                            <Typography style={{ textAlign: "left" }}>
                                                                                                <b>Name:</b> {candidate.candidateName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                            <b>PR Number:</b> {candidate.candidatePrNumber}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                            <b>ID:</b><label id={candidate.candidatePrNumber}></label><br />
                                                                                                <b>Gender:</b> {candidate.gender}<br />
                                                                                                <b>College:</b> {candidate.college}<br />
                                                                                                <b>Department:</b> {candidate.department}<br />
                                                                                                <b>Description:</b> {candidate.description}<br />

                                                                                                <Button name={candidate.candidatePrNumber} onClick={() => { setId(candidate) }} className="btn btn-success" style={{ marginTop: "10px", width: "200px", marginRight: "10px" }}>SET ID & ACCEPT</Button>

                                                                                                <Button className="btn btn-danger" onClick={() => { rejectRequest(candidate) }} style={{ marginTop: "10px", width: "200px", marginRight: "10px" }}>REJECT</Button>
                                                                                                <br />
                                                                                                <br />
                                                                                                <span hidden name={candidate.candidatePrNumber} style={{ color: "blue", display: "flex" }}>
                                                                                                    <BarLoader width={2000} height={3} color='blue' loading />
                                                                                                </span>
                                                                                                <span hidden name={candidate.candidatePrNumber} style={{ marginLeft: "200px", color: "blue", fontWeight: "bold" }}>
                                                                                                    Please wait, request is being processed...
                                                                                            </span>
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                    : <span hidden></span>
                                                                            }
                                                                        </Grid>
                                                                        : null
                                                                }
                                                            </span>
                                                        )
                                                    }
                                                </span>
                                            </>
                                            :
                                            <h3>No Candidate Requests</h3>
                                    }
                                </Paper>
                            </Grid>
                        </span>
                        :
                        null
                }
            </div >
            <br />
            <FooterWV />
        </Delayed >
    )
}

export default CandidateRequests;
