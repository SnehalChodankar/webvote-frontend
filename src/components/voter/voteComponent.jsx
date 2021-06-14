import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import axios from 'axios';

import FooterWV from '../common/footerComponent';
import Delayed from '../common/delayed';
import VoterNavbar from '../navbar/voterNavbar';

import { makeStyles } from '@material-ui/core/styles';

import { Grid, Paper, TextField, Card, CardHeader, CardContent, Typography, Button, FormControl, InputLabel, Input, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Web3 from 'web3';
import { webvoteABI } from '../../smartContractDetails/abi';

const bcrypt = require('bcryptjs');

var Tx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

const useStyles = makeStyles({
    media: {
        height: 140,
    },
});

var idArray = [];

/*
-----------------------------------Vote Component---------------------------------------------
This component allows voters to vote for their choosen candidate.

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Function to get accepted Candidates:
- getAcceptedCandidates()
    :- Sends axios request to server.js file on path '/getCandidates' to get all the candidates.

Functions for setting avtar for candidates displayed:
- getAvtar(gender, id)
    :- This function is used to set avtars(pictures) to the candidate details displayed in cards.
       The avtar is assigned based on the gender and candidateId. First, the candidateId received as 
       parameter is checked if it is in the idArray, if that id is not present, then we assign the required
       avtar for that particular id by first checking for the element in the DOM displayed.

Functions to caste vote:
- casteVote(candidateId, prNumber)
    :- Compare the password entered as confirmation for vote with the  one stored in the database for that
       particular voter.
- sendtoSmartContract(id)
    :- Calls a smart contract function to vote for the candidate selected using it's id. This also makes sure
       voter is marked as true for that election after his vote is counted in order to prevent him from voting
       again.
- getVoteCount(id)
    :- Makes a call to smart contract getter method of candidates mapping to check if id passed is nota or not.
- sendToDB(id, voteCount)
    :- This function makes a axios request to the server.js file on the path '/updateVoteCount' to update
       the voteCount field for a particular candidate and after successful update, user is redirected to live
       elections.
----------------------------------------------------------------------------------------------
*/

function Vote() {
    let history = useHistory();
    let location = useLocation();

    const classes = useStyles();

    //-----------------------------------Section Start: variables & State Variables----------------------------------------------
    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);
    const contract = new web3.eth.Contract(webvoteABI, location.state.electionAddress);

    const [data, setData] = useState(null);
    const [acceptedCandidates, setAcceptedCandidates] = useState(null);
    const [password, setPassword] = useState("");
    //-----------------------------------Section Start: variables & State Variables----------------------------------------------

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                if (res.data.prNumber == null) {
                    history.push('/');
                }
                getAcceptedCandidates();
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Functions for user validation-------------------------------

    //-------------------------------Section Start: Function to get accepted Candidates-------------------------------

    /**
     * Get all accepted candidates of particular election
     */
    const getAcceptedCandidates = () => {
        axios({
            method: "POST",
            data: {
                electionAddress: location.state.electionAddress,
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/getCandidates',
        })
            .then(res => {
                setAcceptedCandidates(res.data);
            });
    }
    //-------------------------------Section Ended: Function to get accepted Candidates-------------------------------

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

    //----------------------------Section Start: Functions for setting avtar for candidates displayed------------

    /**
     * Set random avtars to candidates based on gender.
     * @param {string} gender gender of candidate
     * @param {string} id candidate id
     * @returns {string} image path
     */
    const getAvtar = (gender, id) => {
        if (idArray.includes(id)) {
            if (document.getElementsByName(id)[0] !== undefined) {
                var imgpath = document.getElementsByName(id)[0].src;
                return imgpath;
            }
            else {
                idArray.push(id);
                if (gender === "male") {
                    var numt = Math.floor(Math.random() * 7);
                    var patht = require('../../images/male/' + numt + '.png').default;
                    return patht;
                } else if (gender === "female") {
                    var numft = Math.floor(Math.random() * 4);
                    var pathft = require('../../images/female/' + numft + '.png').default;
                    return pathft;
                }
            }
        }
        else {
            idArray.push(id);
            if (gender === "male") {
                var num = Math.floor(Math.random() * 7);
                var path = require('../../images/male/' + num + '.png').default;
                return path;
            } else if (gender === "female") {
                var numf = Math.floor(Math.random() * 4);
                var pathf = require('../../images/female/' + numf + '.png').default;
                return pathf;
            }
        }
    }
    //--------------------------Section Ended: Functions for setting avtar for candidates displayed------------

    /**
     * Displays confirm vote button.
     * @param {string} candidateId candidate id
     */
    const showVote = (candidateId) => {
        if (candidateId === 1) {
            document.getElementById(candidateId).setAttribute("hidden", true);
            document.getElementById("nota").removeAttribute("hidden");
        }
        else {
            document.getElementById(candidateId).setAttribute("hidden", true);
            document.getElementsByName(candidateId)[1].removeAttribute("hidden");
            document.getElementsByName(candidateId)[2].removeAttribute("hidden");
        }
    }

    //----------------------Section Start: Functions to caste vote-----------------------------------
    /**
     * Compare password and validate the voter.
     * @param {string} candidateId candidate id
     * @param {number} prNumber candidate PR number
     */
    const casteVote = (candidateId, prNumber) => {
        bcrypt.compare(password, data.password, (err, res) => {
            if (res) {
                if (prNumber === 0) {
                    document.getElementById("nota-loader").removeAttribute("hidden");
                }
                else {
                    document.getElementById(prNumber).removeAttribute("hidden");
                }
                sendtoSmartContract(candidateId);
            }
            else {
                alert("Incorrect Password!!!");
            }
        });
    }

    /**
     * Registers vote in smart contract.
     * @param {number} id candidate id for voting
     */
    const sendtoSmartContract = (id) => {
        const privateKey = Buffer.from(data.privateKey.substring(2), 'hex');

        web3.eth.getTransactionCount(data.walletAddress, (error, txCount) => {

            const data = contract.methods.vote(id).encodeABI();

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: location.state.electionAddress,
                gasLimit: web3.utils.toHex(1000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: data
            };

            const tx = new Tx(txObject, { 'chain': 'ropsten' });
            tx.sign(privateKey);

            const serializedTransaction = tx.serialize();
            const raw = '0x' + serializedTransaction.toString('hex');

            web3.eth.sendSignedTransaction(raw).once('receipt', function (receipt) {
                getVoteCount(id);
            });
        });
    }

    /**
     * Fetch the vote count of particular candidate.
     * @param {number} _id candidate id
     */
    const getVoteCount = (_id) => {
        contract.methods.candidates(_id).call((error, result) => {
            if (_id !== 1) {
                sendToDB(_id, result[2]);
            }
            else {
                alert("Vote Casted Successfully.");
                history.push('/voter/home');
            }
        });
    }

    /**
     * Update votes of particular candidate
     * @param {number} _id candidate id
     * @param {number} voteCount candidate vote count
     */
    const sendToDB = (_id, voteCount) => {
        axios({
            method: "POST",
            data: {
                electionAddress: location.state.electionAddress,
                candidateId: _id,
                voteCount: voteCount
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/updateVoteCount',
        })
            .then(res => {
                alert(res.data);
                history.push('/voter/home');
            });
    }
    //----------------------Section Ended: Functions to caste vote-----------------------------------

    return (
        <Delayed waitBeforeShow={500}>
            {
                data ?
                    <VoterNavbar data={data} />
                    : null
            }

            <div>
                {
                    data ?
                        <span>
                            <Grid style={{ position: "absolute" }}>
                                <Paper elevation="10" style={{ width: "600px", marginLeft: "50px", marginTop: "25px" }}>
                                    <Card>
                                        <CardHeader
                                            title="Election Details"
                                            style={{ backgroundColor: "#E4EBE9" }}
                                        />
                                        <CardContent style={{ fontSize: "18px" }}>
                                            <Typography gutterBottom>
                                                <p style={{ marginLeft: "30px", textAlign: "left" }}>
                                                    <TextField label="Election Title" style={{ width: "250px" }} disabled value={location.state.type} />
                                                    <TextField label='Voting Ends On' style={{ marginLeft: "20px", width: "250px" }} disabled value={convertISOtoLocal(location.state.votingEndDateTime)} />
                                                    <br />
                                                    <TextField label="Election Address" style={{ marginTop: "20px", width: "400px" }} disabled value={location.state.electionAddress} />
                                                    <br />
                                                    <TextField label="College" style={{ marginTop: "20px", width: "530px" }} disabled value={location.state.college} />
                                                </p>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>

                            <Grid style={{ marginLeft: "650px", position: "absolute" }}>
                                <Paper elevation="10" style={{ width: "600px", marginLeft: "50px", marginTop: "25px" }}>
                                    <Card>
                                        <CardHeader
                                            title="Your Details"
                                            style={{ backgroundColor: "#E4EBE9" }}
                                        />
                                        <CardContent style={{ fontSize: "18px" }}>
                                            <Typography gutterBottom>
                                                <p style={{ paddingLeft: "30px", textAlign: "left" }}>
                                                    <TextField multiline label="Name" style={{ width: "200px" }} disabled value={data.firstname + " " + data.lastname} />
                                                    <TextField multiline label="PR Number" style={{ marginLeft: "20px", width: "100px" }} disabled value={data.prNumber} />
                                                    <TextField multiline label="Roll Number" style={{ marginLeft: "20px", width: "100px" }} disabled value={data.rollNumber} />
                                                    <br />
                                                    <TextField label="Wallet Address" style={{ marginTop: "20px", width: "400px" }} disabled value={data.walletAddress} />
                                                    <br />
                                                    <TextField label="College" style={{ marginTop: "20px", width: "530px" }} disabled value={data.college} />
                                                </p>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>

                            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

                            <Grid>
                                <Paper elevation="10" style={{ width: "1250px", marginLeft: "50px", marginTop: "40px" }}>
                                    <Card>
                                        <CardHeader
                                            title="Candidates"
                                            style={{ backgroundColor: "#E4EBE9" }}
                                        />
                                        <CardContent style={{ fontSize: "18px", marginTop: "20px" }}>
                                            <Typography gutterBottom>
                                                {
                                                    acceptedCandidates ?
                                                        <>
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                direction="row"
                                                                justify="flex-start"
                                                                alignItems="flex-start"
                                                            >
                                                                {
                                                                    acceptedCandidates.map((candidate) =>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Card elevation="10" style={{ marginBottom: "10px" }}>
                                                                                <CardHeader
                                                                                    title={candidate.candidateName}
                                                                                    subheader={<span>ID: {candidate.candidateId}</span>}
                                                                                    style={{ backgroundColor: "#E4EBE9" }}
                                                                                    titleTypographyProps={{ variant: 'h6' }}
                                                                                />
                                                                                <CardContent>
                                                                                    <Typography gutterBottom>
                                                                                        <img name={candidate.candidateId} alt="avtar" height={150} src={getAvtar(candidate.gender, candidate.candidateId)} />
                                                                                        <br />

                                                                                        <p style={{ textAlign: "left", fontSize: "15px" }}>
                                                                                            <b>Department: </b>{candidate.department}
                                                                                            <br />
                                                                                            <b>College: </b>{candidate.college}
                                                                                            <br />
                                                                                            <b>Description: </b>{candidate.description}
                                                                                        </p>

                                                                                        <Button id={candidate.candidateId} onClick={() => { showVote(candidate.candidateId) }} variant="contained" color="secondary" className={classes.button} startIcon={<i class="fas fa-vote-yea"></i>}>VOTE</Button>

                                                                                        <span hidden name={candidate.candidateId}>
                                                                                            <FormControl style={{ width: 200 }}>
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

                                                                                            <Button name={candidate.candidateId} onClick={() => { casteVote(candidate.candidateId, candidate.candidatePrNumber) }} variant="contained" color="secondary" style={{ marginTop: "10px" }} className={classes.button} startIcon={<i class="fas fa-vote-yea"></i>} > CONFIRM VOTE </Button>
                                                                                        </span>

                                                                                        <br />
                                                                                        <span hidden id={candidate.candidatePrNumber}>
                                                                                            <PulseLoader color="#ec407a" size={8} loading />
                                                                                        </span>
                                                                                    </Typography>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Grid>
                                                                    )
                                                                }

                                                                <Card elevation="10" style={{ marginLeft: "10px", marginTop: "8px", width: "23%" }}>
                                                                    <CardHeader
                                                                        title="NOTA"
                                                                        style={{ backgroundColor: "#E4EBE9" }}
                                                                        subheader={<span>ID: 1</span>}
                                                                    />

                                                                    <CardContent style={{ fontSize: "18px" }}>
                                                                        <Typography gutterBottom>
                                                                            <img alt="nota" height={150} src={require('../../images/nota.png').default} />
                                                                            <br /><br />

                                                                            <p style={{ color: "red", fontSize: "20px", paddingBottom: "10px" }}>
                                                                                <b>None of the above...</b>
                                                                            </p>
                                                                            <br />
                                                                            <Button id={1} onClick={() => { showVote(1) }} variant="contained" color="secondary" className={classes.button} startIcon={<i class="fas fa-vote-yea"></i>}> VOTE </Button>

                                                                            <span hidden id="nota">
                                                                                <FormControl style={{ width: 200 }}>
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

                                                                                <Button name={1} onClick={() => { casteVote(1, 0) }} variant="contained" color="secondary" style={{ marginTop: "10px" }} className={classes.button} startIcon={<i class="fas fa-vote-yea"></i>}>CONFIRM VOTE</Button>
                                                                            </span>
                                                                            <br />

                                                                            <span hidden id="nota-loader">
                                                                                <PulseLoader color="#ec407a" size={8} loading />
                                                                            </span>
                                                                        </Typography>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        </>
                                                        : null
                                                }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>
                            <br /><br />
                        </span>
                        : null
                }
            </div>
            <br />
            <FooterWV />
        </Delayed>
    );
}

export default Vote;