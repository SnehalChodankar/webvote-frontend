import React from 'react';
import NavbarWVLogin from '../navbar/navbarComponentLogin';
import FooterWV from './footerComponent';

import logo from '../../images/webvotelogo.png';
import overview from '../../images/howtoimages/Overview.png';
import RegisterButton from '../../images/howtoimages/RegisterButton.png';
import RegistrationForm from '../../images/howtoimages/RegistrationForm.png';
import Credentials from '../../images/howtoimages/Credentials.png';
import Summary from '../../images/howtoimages/Summary.png';
import GenerateOTP from '../../images/howtoimages/GenerateOTP.png';
import Login from '../../images/howtoimages/Login.png';
import OTP from '../../images/howtoimages/OTP.jpg';
import Upcoming from '../../images/howtoimages/Upcoming.png';
import Application from '../../images/howtoimages/Application.png';
import Applied from '../../images/howtoimages/Applied.png';
import Live from '../../images/howtoimages/Live.png';
import Vote from '../../images/howtoimages/Vote.png';
import Confirm from '../../images/howtoimages/Confirm.png';
import Statistics from '../../images/howtoimages/Statistics.png';
import LiveStats from '../../images/howtoimages/LiveStats.png';
import Results from '../../images/howtoimages/Results.png'
import Winner from '../../images/howtoimages/Winner.png';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PostAddIcon from '@material-ui/icons/PostAdd';
import BarChartIcon from '@material-ui/icons/BarChart';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/*
---------------------------------------------How to---------------------------------------
This component is used allow anyone to send an enquiry email to us.
----------------------------------------------------------------------------------------------------
*/

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: "18px",
    },
});

function HowTo() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div className={classes.list}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem style={{ paddingLeft: "38px" }}>
                    <img src={logo} width="170px" alt="Logo" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} href="#overview">
                    <ListItemIcon><FindInPageIcon /></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='Overview' />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} href="#howtoregister">
                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='How to Register?' />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} href="#howtologin">
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='How to login?' />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} href="#applyascandidate">
                    <ListItemIcon><PostAddIcon /></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='Apply as candidate' />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} href="#howtovote">
                    <ListItemIcon><span className="fas fa-vote-yea fa-lg"></span></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='How to Vote?' />
                </ListItem>
            </List >
            <Divider />
            < List >
                <ListItem button component={Link} href="#howtoseeresults">
                    <ListItemIcon><BarChartIcon /></ListItemIcon>
                    <ListItemText style={{ color: "black" }} primary='How to see Results?' />
                </ListItem>
            </List >
        </div >
    );

    return (
        <div>
            <NavbarWVLogin />
            <div style={{ position: "fixed" }}>
                {['left'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button variant="contained" style={{ color: "#15784E" }} onClick={toggleDrawer(anchor, true)}><b>Quick Links!</b></Button>
                        <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} >
                            {list(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
            </div>

            <div id="overview" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }}>
                <h2>Overview</h2>
                <p>Webvote is a <b>Blockchain</b> based <b>Voting DApp</b> specially designed for engeering colleges in Goa.<br />
                The overall process is simple.
                <br /> Simply <b>register</b> yourself using your college details, <b>vote</b> for candidate of your choice and see the <b>results</b> live.<br />
                    Also you may <b>apply as candidate</b> for upcoming elections if you are eligible.</p>
                <img src={overview} width="60%" alt="" />
            </div>
            <hr />
            <div id="howtoregister" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }}>
                <h2>How to Register?</h2>
                <p>Register yourself using basic college details as shown below.<br /> Rest all we'll handle it.</p>
                <div style={{ width: "80%", marginLeft: "140px" }}>
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 1:</b> Go to Registration page by clicking on the <b>Register</b> button on Home Page.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={RegisterButton} alt="Register Button" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 2:</b> Enter your <b>personal</b> and <b>college</b> details.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={RegistrationForm} alt="Registration Form" width="100%" />
                                    <br /><br />
                                    <p style={{ textAlign: "left", paddingLeft: "20px", color: "red" }}>
                                        Important!:<br />
                                        1. Enter correct <b>Mobile Number</b>, you will be receiving OTP via SMS on that number during Login.<br />
                                        2. Enter correct <b>PR Number</b>, it will serve as your username for logging in.
                                    </p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 3:</b> Review and Confirm <b>Credentials</b>.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Credentials} alt="Credentials" width="100%" />
                                    <br /><br />
                                    <p style={{ textAlign: "left", paddingLeft: "20px", color: "red" }}>
                                        Important!<br />
                                        1. Make a note of <b>Wallet Details</b>, and don't forget your password.<br />
                                        2. Do not share <b>Private Key </b>displayed.
                                    </p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 4:</b> Review and Submit your details.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Summary} alt="Summary" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
            <hr />
            <div id="howtologin" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }}>
                <h2>How to Login?</h2>
                <div style={{ width: "80%", marginLeft: "140px" }}>
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 1:</b> Enter <b>Username (PR Number)</b> and <b>password</b> and click on <b>GENERATE OTP</b>.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={GenerateOTP} alt="Generate OTP" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 2:</b> Enter <b>OTP</b> and click on <b>Login</b> button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Login} alt="Login Form" width="70%" />&nbsp;&nbsp;
                                    <img src={OTP} alt="OTP" width="200px" height="370px" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
            <hr />
            <div id="applyascandidate" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }} >
                <h2>Want to Apply as Candidate?</h2>
                <h3>Follow steps below...</h3>
                <div style={{ width: "80%", marginLeft: "140px" }}>
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 1:</b> Go to <b>Upcoming Elections</b> and click on <b>Apply as Candidate</b>.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Upcoming} alt="Upcoming Election" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 2:</b> Fill the form and click on <b>APPLY</b> button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Application} alt="Application" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 3:</b> Once applied, application will be reviewed and accordingly it will be accepted or rejected.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Applied} alt="Application" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
            <hr />
            <div id="howtovote" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }}>
                <h2>How to Vote?</h2>
                <div style={{ width: "80%", marginLeft: "140px" }}>
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 1:</b> Go to <b>Live Elections page</b> and if eligible, <b>caste your vote</b>.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Live} alt="Live Elections" width="100%" /><br /><br />
                                    <p style={{ textAlign: "left", paddingLeft: "20px", color: "red" }}>
                                        Important!<br />
                                        1. If not eligible, you won't see the <b>Caste Your Vote</b> button.<br />
                                    </p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 2:</b> Select candidate of your choice and click on <b>Vote</b> button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Vote} alt="Caste Vote" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 3:</b> Confirm password and click on <b>Confirm Vote</b> button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Confirm} alt="Confirm Vote" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 4:</b> Voted successfully, now you can see live results, just click on <b>Statistics </b>button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Statistics} alt="Statistics" width="100%" /><br /><br />
                                    <p>
                                        <b>Live Statistics Page...</b>
                                    </p>
                                    <img src={LiveStats} alt="Live Statistics" width="100%" /><br /><br />
                                    <p style={{ textAlign: "left", paddingLeft: "20px", color: "red" }}>
                                        Important!<br />
                                        1. Click on yellow refresh icon besides vote count column to see the live vote counts.
                                    </p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
            <hr />
            <div id="howtoseeresults" style={{ fontStyle: "italic", paddingTop: "20px", paddingBottom: "20px" }}>
                <h2>How to see Final Results?</h2>
                <div style={{ width: "80%", marginLeft: "140px" }}>
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 1:</b> Go to <b>Results Page</b> and click on <b>Results</b> button.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Results} alt="Results" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography className={classes.heading}>
                                    <b>Step 2:</b> View the final detailed graphical results, and see who the winner is.
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <img src={Winner} alt="Winner" width="100%" />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
            <FooterWV />
        </div >
    );
}

export default HowTo;