import React from 'react';

import { Grid, Paper } from '@material-ui/core';

import { Button, Table } from 'react-bootstrap';

import Web3 from 'web3';
import { webvoteABI } from '../../smartContractDetails/abi';

require('dotenv').config();

/*
------------------------------------------------Candidate Vote Count Table--------------------------------
This component is used to display only the candididates and their vote count fetching from the smart contract.

Functions for voteCount:
- voteUpdate()
    :- This function is used for calling the getVoteCount function on all the acceptedCandidates using a 
       for loop.
- getVoteCount(_id)
    :  This function makes a call to smart contract getter function of candidates mapping and then fetches
       the required voteCounts we get to display on web page.
----------------------------------------------------------------------------------------------------------
*/

function CandidateVoteCountTable(props) {
    //-----------------------------------Section Start: Variables----------------------------------------------
    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);
    //-----------------------------------Section Ended: Variables----------------------------------------------

    //-----------------------------------Section Start: Functions for voteCount----------------------------------------------
    const contract = new web3.eth.Contract(webvoteABI, props.electionAddress);

    /**
     * Fetches vote count of every candidate to show on the statistics page.
     */
    const voteUpdate = () => {
        getVoteCount(1);
        var len = props.acceptedCandidates.length;
        for (let index = 1; index <= len; index++) {
            getVoteCount(props.acceptedCandidates[index - 1].candidateId);
        }
    }

    /**
     * Retreives vote count of particular candidate.
     * @param {number} _id candidate id
     */
    const getVoteCount = (_id) => {
        contract.methods.candidates(_id).call((error, result) => {
            document.getElementById(_id).innerHTML = result[2];
        });
    }
    //-----------------------------------Section Ended: Functions for voteCount----------------------------------------------

    return (
        <Grid style={{ position: "relative" }}>
            <Paper elevation="10" style={{ width: "113%", marginLeft: "0px", marginTop: "40px" }}>
                <Table striped bordered hover size="xl">
                    <thead style={{ backgroundColor: "gray", color: "white", margin: "20px" }}>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Vote Count <Button onClick={() => { voteUpdate() }} className="btn" variant="outlined"><i class="fas fa-sync-alt" style={{ color: "gold" }}></i></Button> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>NOTA</td>
                            <td>-</td>
                            <td><span id="1"></span>{getVoteCount(1)}</td>
                        </tr>
                        {
                            props.acceptedCandidates.map((candidate) =>
                                <tr>
                                    <td>{candidate.candidateId}</td>
                                    <td>{candidate.candidateName}</td>
                                    <td>{candidate.description}</td>
                                    <td><span id={candidate.candidateId}></span>{getVoteCount(candidate.candidateId)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </Paper>
        </Grid>
    );
}

export default CandidateVoteCountTable;