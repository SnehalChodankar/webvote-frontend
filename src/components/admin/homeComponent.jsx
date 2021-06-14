import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import axios from 'axios';

import FooterWV from '../common/footerComponent';
import Delayed from '../common/delayed';
import AdminNavbar from '../navbar/adminNavbar';

import { Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import Web3 from 'web3';

var Tx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

/*
-----------------------------------------Home Component-----------------------------------------------------
This component diplays the live elections to the admin and also provides to link to check statistics.

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

Function to get all the current elections:
- getElection()
    :- Sneds an axios request to server.js file on "/getElections" path to get the elections in voting state.
    
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

function AdminHome() {
    //-----------------------------------Section Start: Variables & States----------------------------------------------

    let history = useHistory();

    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);

    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [isNotLive, setIsNotLive] = useState(false);


    //-----------------------------------Section Ended: Variables & States----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Checks if user is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/user'
        })
            .then(res => {
                setData(res.data);
                if (res.data.username == null) {
                    history.push('/admin/login');
                }
                getElections();
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
        })
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

    //-------------------------------Section Start: Function to get all the current elections------------------

    /**
     * Get all elections with voting state.
     */
    const getElections = () => {
        axios({
            method: "POST",
            data: {
                status: "voting"
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getElections',
        })
            .then(res => {
                setElections(res.data);
                if (res.data.length === 0)
                    setIsNotLive(true);
            });
    }
    //-------------------------------Section Ended: Function to get all the current elections------------------

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

    /**
     * Checks if election college matches with voter's college
     * @param {string} _college election college.
     * @returns {boolean} true if matches
     */
    const checkElectionCollege = (_college) => {
        if (_college === data.college)
            return true;
        else
            return false;
    }

    /**
     * Checks if logged in user is same as username.
     * @param {string} _username username of election creator
     */
    const checkElectionAdmin = (_username) => {
        if (_username === data.username)
            return true;
        else
            return false;
    }
    //---------------------------------Section Start: Functions to cancel election-----------------------------------

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
    //---------------------------------Section Ended: Functions to cancel election-----------------------------------

    /**
     * Route to statistics page
     * @param {JSON} _election election details
     */
    const gotoStatistics = (_election) => {
        history.push({
            pathname: '/admin/home/statistics',
            state: _election
        });
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
                        <Grid container
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
                                                    <span>
                                                        {election.college}
                                                        <h5 style={{ marginBottom: "0px", marginTop: "5px" }}><span class="badge rounded-pill bg-success ">Live</span></h5>
                                                    </span>
                                                }
                                            />

                                            <CardContent style={{ fontSize: "18px" }}>
                                                <Typography gutterBottom>
                                                    <b>Election Started at: </b>{convertISOtoLocal(election.votingStartDateTime)}<br />
                                                    <b>Election Ends at: </b>{convertISOtoLocal(election.votingEndDateTime)}<br />
                                                    <br />
                                                    {
                                                        checkElectionCollege(election.college) ?
                                                            <span>
                                                                {
                                                                    checkElectionAdmin(election.adminUsername) ?
                                                                        <span>
                                                                            <Button onClick={() => { gotoStatistics(election) }} className="btn btn-warning" style={{ marginLeft: "5px" }}><span >Statistics</span></Button>
                                                                            <Button onClick={() => { cancelElection(election.electionAddress) }} className="btn btn-danger" style={{ marginLeft: "25px" }}>Cancel Election</Button>
                                                                        </span>
                                                                        :
                                                                        null
                                                                }
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
                isNotLive ?
                    <div id="nodata" style={{ maxHeight: "800px", alignContent: "center", paddingTop: "156px", paddingBottom: "210px" }}>
                        <i class="fas fa-cubes fa-5x"></i>
                        <p style={{ fontSize: "20px" }}>
                            No Live Elections!
                            </p>
                    </div>
                    : null
            }
        </Delayed>
    );
}

export default AdminHome;