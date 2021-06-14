import React from 'react';

import { Grid, Paper } from '@material-ui/core';

import Web3 from 'web3';
import { webvoteABI } from '../../smartContractDetails/abi';

import ApexCharts from 'apexcharts';

require('dotenv').config();

/*
---------------------------------------------Candidate  Graph---------------------------------------
This component is used to display the vote count of all the candidates of a particular electionAddress
in a column graph created using apexCharts.
ref: https://apexcharts.com/javascript-chart-demos/column-charts/distributed/

Functions for voteCount:
- getVoteCount()
    :- This function is used for calling the fetchVoteFromSC function on all the acceptedCandidates using a 
       for loop.
- fetchVoteFromSC(_id)
    :- This function makes a call to smart contract getter function of candidates mapping and then fetches
       the required voteCounts we get to display on web page.

Function for Displaying Graph:
- generateChart()
    :- This function is used to generate the required column graph for the voteCount of all the candidates.
       The setTimeout function of javascript is used to delay the execution to avoid the element not found
       error, which arises when DOM is not loaded properly.
       Then the options for graph are set and then using Chart.render() the graph is displayed on the DOM.
       Lastly the getWinner() function is called to display the winner of that particular election.

Function for finding winner:
- getWinner()
    :- This function first sorts the votes array in decending order in order to check if first two elements
       of that array are same. If same, it means the election is ended as a draw.
       If first two elements are not same, it means that there is only one winner, so to check that, the 
       for loop is run on acceptedCandidates list to check candidateId with highest voteCount.
       Once the id is found, its again checked with the NOTA candidate entry to check if its higher then 
       NOTA as well.
----------------------------------------------------------------------------------------------------
*/

function CandidateGraph(props) {
    //-----------------------------------Section Start: Variables----------------------------------------------
    var candidateVotes = [];
    var candidateNames = [];
    var votes = [];
    var totalVotes = 0;

    var highestVote = 0;
    var highestIndex = 0;

    let web3 = new Web3(process.env.REACT_APP_URL_INFURA);
    const contract = new web3.eth.Contract(webvoteABI, props.electionAddress);
    //-----------------------------------Section Ends: Variables----------------------------------------------

    //-----------------------------------Section Start: Functions for voteCount----------------------------------------------

    /**
     * Fetch the vote counts for all the candidates.
     */
    const getVoteCount = () => {
        fetchVoteFromSC(1);
        var len = props.acceptedCandidates.length;
        for (let index = 1; index <= len; index++) {
            fetchVoteFromSC(props.acceptedCandidates[index - 1].candidateId);
        }
        generateChart();
    }

    /**
     * Retreives votes of particular candidate from smart contract instance.
     * @param {number} _id candidate id
     */
    const fetchVoteFromSC = (_id) => {
        contract.methods.candidates(_id).call((error, result) => {
            candidateNames.push(result[1]);
            candidateVotes.push(result[2]);
            votes.push(result[2]);
            totalVotes = totalVotes + parseInt(result[2]);
        });
    }
    //-----------------------------------Section Ended: Functions for voteCount----------------------------------------------

    //-----------------------------------Section Start: Function for Displaying Graph----------------------------------------------

    /**
     * Generates Result Chart.
     */
    const generateChart = () => {
        setTimeout(() => {
            var options = {
                series: [{
                    name: "Vote Count",
                    data: candidateVotes
                }],
                chart: {
                    height: 450,
                    type: 'bar',
                    events: {
                        click: function (chart, w, e) {
                            console.log(chart, w, e)
                        }
                    }
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            position: 'top'
                        },
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#333']
                    }
                },
                legend: {
                    show: false
                },
                xaxis: {
                    title: {
                        text: 'Candidates',
                    },
                    categories: candidateNames,
                    labels: {
                        style: {
                            fontSize: '12px',
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Vote Count',
                    },
                },
            };

            var chart = new ApexCharts(document.getElementById("chart"), options);
            chart.render();

            getWinner();

        }, 2000);

    }
    //-----------------------------------Section Ended: Function for Displaying Graph----------------------------------------------

    //-----------------------------------Section Start: Function for finding winner----------------------------------------------

    /**
     * Declare the winner of the election based on the vote counts.
     */
    const getWinner = () => {
        votes.sort();
        votes.reverse();

        if (votes[0] === votes[1]) {
            document.getElementById("winner").innerHTML = "It's a DRAW!!!";
        }
        else {
            for (let index = 0; index < props.acceptedCandidates.length; index++) {
                if (props.acceptedCandidates[index].voteCount > highestVote) {
                    highestVote = props.acceptedCandidates[index].voteCount;
                    highestIndex = props.acceptedCandidates[index].candidateId;
                }
            }
            contract.methods.candidates(1).call((error, result) => {
                if (result[2] > highestVote) {
                    highestVote = result[2];
                    highestIndex = 1;
                }
            });
            contract.methods.candidates(highestIndex).call((error, result) => {
                document.getElementById("winner").innerHTML = "Winner is: " + result[1] + ", ID: " + highestIndex;
                document.getElementById("totalVotes").innerHTML = "Total Votes: " + totalVotes;
            });
        }
    }
    //-----------------------------------Section Ended: Function for finding winner----------------------------------------------

    return (
        <Grid style={{ position: "absolute" }}>
            <Paper elevation="10" style={{ width: "810px", marginLeft: "450px", paddingBottom: "30px" }}>
                <h3 style={{ padding: "10px", backgroundColor: "#E4EBE9" }}>Results</h3>

                {getVoteCount()}
                <b><span id="totalVotes" style={{ marginRight: "100px" }}></span></b>
                <b><span id="winner"></span></b>

                <div id="chart"></div>
            </Paper>
        </Grid>
    );
}

export default CandidateGraph;