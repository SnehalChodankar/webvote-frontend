import React from 'react';
import { Grid, Paper, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

/*
---------------------------------------Candidates Display--------------------------------------------------
This component is used to display the candidate information for a particular electionAddress which is
received via history.push from previous page(live elections/ results).

Functions for setting avtar for candidates displayed:
- getAvtar(gender, id)
    :- This function is used to set avtars(pictures) to the candidate details displayed in cards.
       The avtar is assigned based on the gender and candidateId. First, the candidateId received as 
       parameter is checked if it is in the idArray, if that id is not present, then we assign the required
       avtar for that particular id by first checking for the element in the DOM displayed.
-----------------------------------------------------------------------------------------------------------
*/

function CandidatesDisplay(props) {
    //-----------------------------------Section Start: Variables----------------------------------------------
    var idArray = [];
    //-----------------------------------Section Ended: Variables----------------------------------------------

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

    return (
        <Grid>
            <Paper elevation="10" style={{ width: "1260px", marginTop: "40px" }}>
                <Card>
                    <CardHeader
                        title="Candidates & their details..."
                        style={{ backgroundColor: "#E4EBE9" }}
                    />
                    <CardContent style={{ fontSize: "18px", marginTop: "20px" }}>
                        <Typography gutterBottom>
                            {
                                props.acceptedCandidates ?
                                    <>
                                        <Grid
                                            container
                                            spacing={2}
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="flex-start"
                                        >
                                            {
                                                props.acceptedCandidates.map((candidate) =>
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
                                                                        <br />
                                                                        <b>PR Number: </b>{candidate.candidatePrNumber}
                                                                        <br />
                                                                        <b>College: </b>{candidate.college}
                                                                        <br />
                                                                        <b>Department: </b>{candidate.department}
                                                                        <br />
                                                                        <b>Gender: </b>{candidate.gender}
                                                                    </p>
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                    </>
                                    : null
                            }
                        </Typography>
                    </CardContent>
                </Card>
            </Paper>
        </Grid>
    );
}

export default CandidatesDisplay;