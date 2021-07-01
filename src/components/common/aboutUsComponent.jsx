import React from 'react';
import { Container, Row, Col, Jumbotron } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardMedia, Typography } from '@material-ui/core';

import AOS from 'aos';
import 'aos/dist/aos.css';

import NavbarWVLogin from '../navbar/navbarComponentLogin';
import FooterWV from './footerComponent';

import logo from '../../images/webvotelogo.png';
import team from '../../images/ionize2.png';

import { details } from '../../teamDetails/details.jsx';

import call from '../../images/icons/call.png';
import email from '../../images/icons/gmail.png';
import linkedin from '../../images/icons/linkedin.png';
import github from '../../images/icons/github.png';
import insta from '../../images/icons/insta.png';

/*
---------------------------------------------About Us---------------------------------------
This component is used to display information of the project, the team and team members.

Functions for checking Id:
- checkId(_id)
    :- This function checks if the id passed as parameter is odd or even. This is done to manipulate the 
       position of the profile images displayed inside the cards.
-checkIdSS(_id)
    :- This function checks if the id passed belongs to specific person (Sidharth and Simran).
----------------------------------------------------------------------------------------------------
*/

AOS.init();

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '250px'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "410px",
        minWidth: "410px"
    },
    detailsRight: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "400px",
        minWidth: "400px"
    },
    content: {
        flex: '1 0 auto',
        alignContent: 'left',
    },
    cover: {
        width: 210,
        height: 210,
        marginTop: "20px",
        marginLeft: "25px",
        borderRadius: "50%"
    },
    coverRight: {
        width: 210,
        height: 210,
        marginTop: "20px",
        borderRadius: "50%"
    }
}));

const duration = 500;

function AboutUs() {
    const classes = useStyles();

    //-----------------------------------Section Start: Functions for checking Id----------------------------------------------

    /**
     * Checks if the _id passed as parameter is even or odd.
     * @param {number} _id member id
     * @returns {boolean} true if even
     */
    const checkId = (_id) => {
        if (_id % 2 === 0)
            return true;
        else
            return false;
    }

    /**
     * Checks if the _id passed as parameter belongs to sidharth or simran.
     * @param {number} _id member id
     * @returns {boolean} true if member ids match
     */
    const checkIdSS = (_id) => {
        if (_id === 4 || _id === 6)
            return true;
        else
            return false;
    }
    //-----------------------------------Section End: Functions for checking Id----------------------------------------------

    return (
        <div>
            <NavbarWVLogin />

            <Jumbotron fluid>
                <Container>
                    <Row style={{ marginTop: "40px", paddingBottom: "30px" }}>
                        <Col style={{ maxWidth: "40%" }}>
                            <img src={logo} alt="Logo" width="300" height="300" />

                        </Col>
                        <Col style={{ maxWidth: "60%" }}>
                            <h1 class="display-4" style={{ fontWeight: "bold", marginTop: "20px" }}>
                                <span style={{ color: "#2F4C58" }}>Web</span>
                                <span style={{ color: "#4999B8" }}>Vote</span>
                            </h1>
                            <p style={{ fontWeight: "600", fontSize: "15px", color: "#15784E" }}>
                                The Ballot is stronger than the Bullet.
                                <br />
                                <i style={{ fontWeight: "100" }}>~Abraham Lincoln</i>
                            </p>

                            <p style={{ color: "#15784E" }}>
                                WebVote allows voters to cast vote from anywhere via browser (web application).
                            This application will outplay existing systems in its strength and cost-effective nature. <br />
                                <br />
                            WebVote uses blockchain technology to securely store the votes.
                            With the integration of blockchain, the vote tempering is close to impossible.
                            </p>
                        </Col>
                    </Row>

                </Container>
            </Jumbotron>
            <hr />
            <Jumbotron fluid>
                <Container>
                    <Row style={{ marginTop: "30px", paddingBottom: "30px" }}>
                        <Col style={{ maxWidth: "60%" }}>
                            <h1 class="display-4" style={{ fontWeight: "bold", marginTop: "20px" }}><span style={{ color: "black" }}>Team</span> <span style={{ color: "red" }}>IO</span><span style={{ color: "black" }}>NIZE</span></h1>
                            <p style={{ fontWeight: "600", fontSize: "15px", color: "#15784E" }}>
                                Individually, we are one drop. Together, we are an ocean.
                                <br />
                                <i style={{ fontWeight: "100" }}>~Ryunosuke Satoro</i>
                            </p>

                            <p style={{ color: "#15784E" }}>
                                <Row>
                                    <Col style={{ textAlign: "left", maxWidth: "70%" }}>
                                        A team of 6 members in total. <b>WebVote</b> is our BE Project.
                                        <br /><br />
                                        <b>Achievements:</b>
                                        <ul>
                                            <li>IDEATE | Techyon 2K20: Second Place</li>
                                            <li>INNOVATIVE PROJECT | Aarush 2K21: Third Place</li>
                                        </ul>

                                        Project Guide: <b>Prof. Mrs. Megha Ainapurkar</b>
                                    </Col>
                                    <Col style={{ textAlign: "left", maxWidth: "30%" }}>
                                        Team Members <br />
                                        <b>Urvesh Vernekar</b><br />
                                        <b>Snehal Chodankar</b><br />
                                        <b>Pooja Raghmode</b><br />
                                        <b>Sidharth Kumar</b><br />
                                        <b>Arundhati Kanekar</b><br />
                                        <b>Simran Beig</b>
                                    </Col>
                                </Row>
                            </p>
                        </Col>
                        <Col style={{ maxWidth: "40%", paddingTop: "20px" }}>
                            <img src={team} alt="Logo" width="300" height="300" />
                        </Col>
                    </Row>

                </Container>
            </Jumbotron>
            <hr />
            <br />

            <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
                <Grid container spacing={4} justify="center">
                    {
                        details.map((member) =>
                            <>
                                {
                                    checkId(member.id) ?
                                        <Grid item xs={12} sm={6} md={6}>
                                            <div data-aos="zoom-in-left" data-aos-duration={duration} data-aos-anchor-placement="bottom-bottom">
                                                <Card className={classes.root}>
                                                    <div className={classes.detailsRight}>
                                                        <CardContent className={classes.content}>
                                                            <Typography component="h5" variant="h5">
                                                                {member.name}
                                                            </Typography>
                                                            <Typography>
                                                                {member.designation}
                                                            </Typography>
                                                            <Typography>
                                                                {"\"" + member.wiseWords + "\""}
                                                                {
                                                                    checkIdSS(member.id) ?
                                                                        <p>&nbsp;</p>
                                                                        :
                                                                        null
                                                                }
                                                            </Typography>
                                                            <Typography style={{ marginTop: "10px" }}>
                                                                <span><a href={member.mobile}><img src={call} width="32" alt="call" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.email}><img src={email} width="32" alt="email" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.linkedin}><img src={linkedin} width="32" alt="linkedin" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.github}><img src={github} width="32" alt="github" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.insta}><img src={insta} width="32" alt="insta" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                            </Typography>
                                                            <Typography style={{ marginTop: "20px" }}>
                                                                {
                                                                    member.interests.map((item) =>
                                                                        <span className="badge rounded-pill bg-success" style={{ marginRight: "10px", padding: "6px", fontSize: "15px" }}>
                                                                            {item}
                                                                        </span>
                                                                    )
                                                                }
                                                            </Typography>
                                                        </CardContent>
                                                    </div>
                                                    <CardMedia
                                                        className={classes.coverRight}
                                                        image={member.image}
                                                    />
                                                </Card>
                                            </div>
                                        </Grid>
                                        :
                                        <Grid item xs={12} sm={6} md={6}>
                                            <div data-aos="zoom-in-right" data-aos-duration={duration} data-aos-anchor-placement="bottom-bottom">
                                                <Card className={classes.root}>
                                                    <CardMedia
                                                        className={classes.cover}
                                                        image={member.image}
                                                    />
                                                    <div className={classes.details}>
                                                        <CardContent className={classes.content}>
                                                            <Typography component="h5" variant="h5">
                                                                {member.name}
                                                            </Typography>
                                                            <Typography>
                                                                {member.designation}
                                                            </Typography>
                                                            <Typography>
                                                                {"\"" + member.wiseWords + "\""}
                                                            </Typography>
                                                            <Typography style={{ marginTop: "10px" }}>
                                                                <span><a href={member.mobile}><img src={call} width="32" alt="call" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.email}><img src={email} width="32" alt="email" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.linkedin}><img src={linkedin} width="32" alt="linkedin" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.github}><img src={github} width="32" alt="github" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                                <span><a href={member.insta}><img src={insta} width="32" alt="insta" /></a>&nbsp;&nbsp;&nbsp;</span>
                                                            </Typography>
                                                            <Typography style={{ marginTop: "20px" }}>
                                                                {
                                                                    member.interests.map((item) =>
                                                                        <span className="badge rounded-pill bg-success" style={{ marginRight: "10px", padding: "6px", fontSize: "15px" }}>
                                                                            {item}
                                                                        </span>
                                                                    )
                                                                }
                                                            </Typography>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            </div>
                                        </Grid>
                                }
                            </>


                        )
                    }
                </Grid>
            </div>

            <br /><br /><br />
            <FooterWV />
        </div>
    );
}

export default AboutUs