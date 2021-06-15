import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { BarLoader } from 'react-spinners';

import axios from 'axios';

import Web3 from 'web3';
import { webVoteByteCode } from '../../smartContractDetails/byteCode';

import { makeStyles } from '@material-ui/core/styles';
import { Container, TextField, FormControlLabel, Checkbox } from '@material-ui/core';

import Delayed from '../common/delayed';
import FooterWV from '../common/footerComponent';
import AdminNavbar from '../navbar/adminNavbar';

var Tx = require('ethereumjs-tx').Transaction;
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
-----------------------------------New Election Component------------------------------------------------------
This component displays a form to create a new election, that is a smart contract instance.
You will get the smart contract in SmartContractDetails folder (webvote.sol file)

Functions for user validation:
- checkLogin()
    :- Sends the axios request to server.js file on path "/user" to get the details of logged in user, if the 
       result returned is null that means no user is logged in so we redirect it, otherwise we set the data.

Functions to create a new Election:
- deployContract()
    :- Here, first we call the getTransactionCount() method, which is signed by admin account(webVoteAddress).
       To this function we write a "txObject", which takes "data"
            data:
                -> this is the smart contract bytecode in hex format, which can be achieved by compiling the 
                   "webvote.sol" file using truffle framework or remix IDE (preferably use remix IDE).
                   On Remix IDE after compiling the smart contract view the compilation details and there in 
                   WEB3DEPLY copy the data attribute's value and store it in one jsx file(in this case - under
                   smartContractDetails byteCode.jsx)
            txObject:
                -> to create txObject we need to supply "nonce", "gasLimit", "gasPrice" and "data"
        Next we link the txObject to ropsten chain and sign it with the admin private key and in return we get
        the "serialized" transaction. This serialized transaction is then converted to hex and then using 
        sendSignedTransaction() it is broadcasted over the blockchain network. And once the receipt is received 
        Election Address is stored in the state variable, which is further sent to database.
- sendtodb()
    :- Sends an axios request to server.js file on "/registerElection" path, which stores the election details 
       in the elections schema. And then the admin is redirected to home page.
---------------------------------------------------------------------------------------------------------------
*/
function ElectionForm() {
    //-----------------------Section Start: Variables and States-----------------------------------------------
    let history = useHistory();

    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);
    const privateKey = Buffer.from(process.env.REACT_APP_WEB_VOTE_PRIVATE_KEY, 'hex');

    const classes = useStyles();

    const [data, setData] = useState(null);
    const [type, setType] = useState("");
    const [votingStartDateTime, setVotingStartDateTime] = useState();
    const [votingEndDateTime, setVotingEndDateTime] = useState();
    const [registrationStartDateTime, setRegistrationStartDateTime] = useState();
    const [registrationEndDateTime, setRegistrationEndDateTime] = useState();
    const [electionAddress, setElectionAddress] = useState("");
    //-----------------------Section Ended: Variables and States-----------------------------------------------

    const [voterColleges, setVoterColleges] = React.useState({
        checkedGEC: false,
        checkedAITD: false,
        checkedPCCE: false,
        checkedRIT: false,
        checkedDBCE: false,
    });

    const handleChange = (event) => {
        setVoterColleges({ ...voterColleges, [event.target.name]: event.target.checked });
    };

    //-------------------------------Section Start: Function for user validation-------------------------------

    /**
     * Checks if admin is logged in.
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
            });
    }

    if (data == null) {
        checkLogin();
    }
    //-------------------------------Section Ended: Function for user validation-------------------------------

    //-------------------------------Section Start: Functions to create a new Election--------------------------

    /**
     * Create a new election instance of smart contract over blockchain network.
     */
    const deployContract = () => {
        document.getElementById("msg").removeAttribute("hidden");

        web3.eth.getTransactionCount(process.env.REACT_APP_WEB_VOTE_ADDRESS, (error, txCount) => {
            const data = webVoteByteCode
            // build a transaction object
            const txObject = {
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(1000000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                data: data
            }

            // sign traction with private key of sender
            const tx = new Tx(txObject, { 'chain': 'ropsten' })
            tx.sign(privateKey)

            // serialize the transaction
            const serializedTransaction = tx.serialize()
            const raw = '0x' + serializedTransaction.toString('hex')

            // broadcast transaction to the network
            web3.eth.sendSignedTransaction(raw).on('receipt', function (receipt) {
                setElectionAddress(receipt.contractAddress);
                document.getElementById('electionAddress').innerHTML = receipt.contractAddress;
                document.getElementById("msg").setAttribute("hidden", true);
            });
        })
    }

    /**
     * Registers election details into database.
     */
    const sendtodb = () => {
        axios({
            method: "POST",
            data: {
                type: type,
                electionAddress: electionAddress,
                adminUsername: data.username,
                college: data.college,
                votingStartDateTime: votingStartDateTime + ":00.000+05:30",
                votingEndDateTime: votingEndDateTime + ":00.000+05:30",
                registrationStartDateTime: registrationStartDateTime + ":00.000+05:30",
                registrationEndDateTime: registrationEndDateTime + ":00.000+05:30",
                state: "registration",
                voterColleges: {
                    checkedGEC: voterColleges.checkedGEC,
                    checkedAITD: voterColleges.checkedAITD,
                    checkedPCCE: voterColleges.checkedPCCE,
                    checkedRIT: voterColleges.checkedRIT,
                    checkedDBCE: voterColleges.checkedDBCE
                }
            },
            withCredentials: true,
            url: process.env.REACT_APP_BACKEND_ORIGIN+'/admin/registerElection',
        })
            .then(res => {
                alert(res.data);
                history.push('/admin/home');
            });
    }
    //-------------------------------Section Ended: Functions to create a new Election--------------------------

    return (
        <Delayed waitBeforeShow={500}>
            {
                data ?
                    <AdminNavbar data={data} />
                    : null
            }
            <br />

            <Container maxWidth="md" style={{ marginTop: "30px", textAlign: "left", marginBottom: "30px" }}>
                <Card style={{ marginBottom: "50px" }}>
                    <Card.Header>
                        <Card.Title style={{ margin: "10px 0 0 10px", textAlign: "center", fontWeight: "bolder", fontSize: "25px" }}>
                            Election Details
                        </Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Card.Text style={{ marginTop: "20px", padding: "0 50px 0 50px" }}>
                            <Card>
                                <Card.Body>
                                    <TextField label="Election Type/ Election Title" name="type" onChange={event => setType(event.target.value)} style={{ width: "50%", marginRight: "20px" }} />
                                    <br />
                                    <label style={{ marginTop: "30px", fontSize: "16px", fontStyle: "italic", fontWeight: "bold" }}>Registration Date Time</label><br />
                                    <TextField id="registrationStart" label="Registration Start Date Time" name="registrationStartDateTime" type="datetime-local" onChange={event => setRegistrationStartDateTime(event.target.value)} className={classes.textField} InputLabelProps={{ shrink: true }} style={{ width: "45%", marginTop: "10px" }} />
                                    <TextField id="registrationEnd" label="Registration End Date Time" name="registrationEndDateTime" type="datetime-local" onChange={event => setRegistrationEndDateTime(event.target.value)} className={classes.textField} InputLabelProps={{ shrink: true }} style={{ width: "45%", marginTop: "10px" }} />

                                    <label style={{ marginTop: "30px", fontSize: "16px", fontStyle: "italic", fontWeight: "bold" }}>Voting Date Time</label><br />
                                    <TextField id="votingStart" label="Voting Start Date Time" name="votingStartDateTime" type="datetime-local" onChange={event => setVotingStartDateTime(event.target.value)} className={classes.textField} InputLabelProps={{ shrink: true }} style={{ width: "45%", marginTop: "10px" }} />
                                    <TextField id="votingEnd" label="Voting End Date Time" name="votingEndDateTime" type="datetime-local" onChange={event => setVotingEndDateTime(event.target.value)} className={classes.textField} InputLabelProps={{ shrink: true }} style={{ width: "45%", marginTop: "10px" }} />

                                    <label style={{ marginTop: "30px", fontSize: "16px", fontStyle: "italic", fontWeight: "bold" }}>Eligible Voters</label><br />
                                    <FormControlLabel
                                        control={<Checkbox checked={voterColleges.checkedGEC} onChange={handleChange} name="checkedGEC" />}
                                        label="Goa College of Engineering"
                                    /><br />
                                    <FormControlLabel
                                        control={<Checkbox checked={voterColleges.checkedAITD} onChange={handleChange} name="checkedAITD" />}
                                        label="Agnel Institute of Technology and Design"
                                    /><br />
                                    <FormControlLabel
                                        control={<Checkbox checked={voterColleges.checkedPCCE} onChange={handleChange} name="checkedPCCE" />}
                                        label="Padre Conceicao College of Engineering"
                                    /><br />
                                    <FormControlLabel
                                        control={<Checkbox checked={voterColleges.checkedRIT} onChange={handleChange} name="checkedRIT" />}
                                        label="Shree Rayeshwar Institute of Engineering and Information Technology"
                                    /><br />
                                    <FormControlLabel
                                        control={<Checkbox checked={voterColleges.checkedDBCE} onChange={handleChange} name="checkedDBCE" />}
                                        label="Don Bosco College of Engineering"
                                    />

                                    <br />
                                    <label style={{ marginTop: "30px", fontSize: "16px", fontStyle: "italic", fontWeight: "bold" }}>Election Instance</label><br />
                                    <Button onClick={deployContract} style={{ backgroundColor: "lightskyblue", marginTop: "10px", borderColor: "lightskyblue", color: "black" }}>Create Instance</Button>
                                    <TextField id="electionAddress" value={electionAddress} label="Election Address" name="electionAddress" type="text" disabled className={classes.textField} style={{ width: "70%", }} />
                                    <br />

                                    <span hidden id="msg" style={{ color: "red" }}>
                                        <span style={{ display: "flex", marginTop: "10px" }}>
                                            <BarLoader width={660} height={3} color='red' loading />
                                        </span>
                                        Please wait for 10-20 seconds for the election address to be displayed in the above textfield...
                                    </span>
                                </Card.Body>
                            </Card>
                        </Card.Text>
                    </Card.Body>

                    <Card.Footer style={{ textAlign: "center" }}>
                        <Button onClick={sendtodb}>Create Election</Button>
                    </Card.Footer>
                </Card>
            </Container>
            <br />
            <FooterWV />
        </Delayed>
    );
}

export default ElectionForm;