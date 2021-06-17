import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Delayed from '../common/delayed';

import axios from 'axios';
import FooterWV from '../common/footerComponent';

import { useHistory } from 'react-router-dom';
import { Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import Web3 from 'web3';
import { webvoteABI } from '../../smartContractDetails/abi';

import VoterNavbar from '../navbar/voterNavbar';

var Tx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

/*
-----------------------------------------------Current Elections------------------------------------------
This component displays all the elections that are in the state of voting. It also validates voter on 
being able to vote for specific election, prevent from voting again if already done, and view statistics 
after voting.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Functions for Auto Refill wallet
- getVotersBalance()
    :- Function is used to check the balance of the voter wallet, and if the balance has gone below a certain
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

Function to getElections:
- getElections()
    :- Sends an axios request to server.js file on path '/getElections' which returns a list of elections 
       present in voting state.

Function to validate voter college:
- checkVoterColleges(voterColleges)
    :- This function is used to check if voter belongs to the same college as the colleges where a perticular
       election is open to vote for.

Function to validate voter:
- checkVoted(voterAddress, electionAddress)
    :- This function is used to check if the logged in user has already voted based on his walletAddress
       in order to prevent him from voting again.
----------------------------------------------------------------------------------------------------------
*/

function CurrentElectionsVoter() {
    let history = useHistory();

    //-----------------------------------Section Start: Variables----------------------------------------------
    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);
    //-----------------------------------Section Ended: Variables----------------------------------------------

    //-----------------------------------Section Start: State Variables----------------------------------------------
    const [data, setData] = useState(null);
    const [elections, setElections] = useState(null);
    const [isNotLive, setIsNotLive] = useState(false);

    //-----------------------------------Section Ended: State Variables----------------------------------------------

    //-------------------------------Section Start: Functions for user validation-------------------------------

    /**
     * Check if user is logged in.
     */
    const checkLogin = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/user',
        })
            .then(res => {
                setData(res.data);
                //console.log(res.data);

                if (res.data.prNumber == null) {
                    history.push('/');
                }
                else {
                    getElections();
                    getVotersBalance(res.data.walletAddress);
                }

            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Functions for Auto Refill wallet-------------------------------

    /**
     * Check Balance of specified address.
     * @param {string} _walletAddress hex address
     */
    const getVotersBalance = (_walletAddress) => {
        web3.eth.getBalance(_walletAddress, (err, res) => {
            console.log(res);
            if (res <= 10000000000000000) {
                sendEthers(_walletAddress);
            }
        })
    }

    /**
     * Send ethers to mentioned address.
     * @param {string} addr hex address to send ether to.
     */
    const sendEthers = (addr) => {
        var senderAccPrivateKey = '0x' + process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY;
        var senderAccPrivateKeyHex = Buffer.from(process.env.REACT_APP_ETH_SENDER_PRIVATE_KEY, 'hex');

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
    //-------------------------------Section Ended: Functions for Auto Refill wallet-------------------------------

    //-------------------------------Section Start: Function to getElections-------------------------------

    /**
     * Get all elections of voting state.
     */
    const getElections = () => {
        axios({
            method: "POST",
            data: {
                status: "voting"
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN + '/getElections',
        })
            .then(res => {
                setElections(res.data);
                if (res.data.length === 0)
                    setIsNotLive(true);
            });
    }
    //-------------------------------Section Ended: Function to getElections-------------------------------

    /**
     * Converts date and time to string format.
     * @param {date} _date date and time to convert.
     * @returns {boolean} converted local date string.
     */
    const convertISOtoLocal = (_date) => {
        var date = new Date(_date).toDateString();
        var time = new Date(_date).toLocaleTimeString();
        var finalDate = date + ", " + time;
        return finalDate;
    }

    //-------------------------------Section Start: Function to validate voter college-------------------------------

    /**
     * Checks if election eligible college with voter college. 
     * @param {boolean} voterColleges key pair mapping of callege name with boolean value.
     * @returns {boolean} true if college matches else false.
     */
    const checkVoterColleges = (voterColleges) => {
        if (voterColleges[0].checkedGEC && data.college === "Goa College of Engineering")
            return true;
        else if (voterColleges[0].checkedAITD && data.college === "Agnel Institute of Technology and Design")
            return true;
        else if (voterColleges[0].checkedPCCE && data.college === "Padre Conceicao College of Engineering")
            return true;
        else if (voterColleges[0].checkedRIT && data.college === "Shree Rayeshwar Institute of Engineering and Information Technology")
            return true;
        else if (voterColleges[0].checkedDBCE && data.college === "Don Bosco College of Engineering")
            return true;
        else
            return false;
    }
    //-------------------------------Section Ended: Function to validate voter college-------------------------------

    //-------------------------------Section Start: Function to validate voter-------------------------------

    /**
     * Checks if the voter has already voted.
     * @param {string} _voterAddress voters address hex value.
     * @param {string} _electionAddress election address hax value.
     */
    const checkVoted = (_voterAddress, _electionAddress) => {
        const contract = new web3.eth.Contract(webvoteABI, _electionAddress);

        contract.methods.voters(_voterAddress).call((error, result) => {
            if (result) {
                document.getElementById(_electionAddress).removeAttribute("hidden");
                document.getElementsByName(_electionAddress)[0].setAttribute("hidden", true);
            }
            else {
                document.getElementById(_electionAddress).setAttribute("hidden", true);
                document.getElementsByName(_electionAddress)[0].removeAttribute("hidden");
            }
        });
    }
    //-------------------------------Section Ended: Function to validate voter-------------------------------

    /**
     * Route to voting page.
     * @param {JSON} _election json election object
     */
    const gotoVote = (_election) => {
        history.push({
            pathname: '/voter/home/vote',
            state: _election
        });
    }

    /**
     * Route to statistics page.
     * @param {JSON} _election json election object
     */
    const gotoStatistics = (_election) => {
        history.push({
            pathname: '/voter/home/statistics',
            state: _election
        })
    }

    return (
        <div>
            <Delayed waitBeforeShow={500}>
                <div>
                    {
                        data ?
                            <VoterNavbar data={data} />
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
                                                                checkVoterColleges(election.voterColleges) ?
                                                                    <>
                                                                        {
                                                                            checkVoted(data.walletAddress, election.electionAddress)
                                                                        }
                                                                        <Button hidden id={election.electionAddress} onClick={() => { gotoStatistics(election) }} className="btn btn-warning" style={{ marginLeft: "5px", width: "150px" }}>
                                                                            <span>Statistics</span>
                                                                        </Button>

                                                                        <Button hidden name={election.electionAddress} onClick={() => { gotoVote(election) }} className="btn btn-primary" style={{ marginLeft: "5px", width: "150px" }}>
                                                                            <span>Cast Your Vote</span>
                                                                        </Button>


                                                                    </>
                                                                    : <span style={{ color: "red" }}>You are Not Eligible to vote for this election.</span>
                                                            }
                                                            {/* <Button className="btn btn-warning" style={{ marginLeft: "5px" }}><span name={election.electionAddress}>Statistics</span></Button> */}
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
                </div>
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
        </div>
    );

}

export default CurrentElectionsVoter;