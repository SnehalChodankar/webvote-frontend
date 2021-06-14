import React from 'react';
import { Navbar, Nav, Card } from 'react-bootstrap';

import logo from '../../../../images/webvotelogo.png';

import FooterWV from '../../../common/footerComponent';

import { Container, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, InputLabel, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

function PersonalDetails({ formData, setForm, navigation }) {
    const classes = useStyles();

    const { firstname, lastname, middlename, gender, dob, mobile, email, college, department, prNumber, rollNumber, year } = formData;

    return (
        <div>
            <div className="shadow">
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
                        <Nav className="mr-auto navlinks offset-4">
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/howto">How To?</Nav.Link>
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/aboutus">About Us</Nav.Link>
                            <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/contactus">Contact Us</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            <Container maxWidth="md" style={{ marginTop: "30px", textAlign: "left", marginBottom: "30px" }}>
                <Card style={{ marginBottom: "50px" }}>

                    <Card.Header>
                        <Card.Title>
                            <ul className="progressbar">
                                <li className="active">User Details</li>
                                <li>Credentials</li>
                                <li>Summary</li>
                            </ul>
                        </Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Card.Text style={{ marginTop: "20px", padding: "0 50px 0 50px" }}>
                            <Card>
                                <Card.Header>
                                    <Card.Title style={{ margin: "10px 0 0 10px" }}>
                                        Personal Details
                                    </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <TextField label="First Name" name="firstname" value={firstname} onChange={setForm} style={{ width: 220, marginRight: "20px" }} />

                                    <TextField label="Middle Name" name="middlename" value={middlename} onChange={setForm} style={{ width: 220, marginRight: "20px" }} />

                                    <TextField label="Last Name" name="lastname" value={lastname} onChange={setForm} style={{ width: 220, marginRight: "20px" }} />
                                    <br />

                                    <FormControl style={{ marginTop: "30px", marginRight: "50px" }}>
                                        <FormLabel style={{ color: "black" }}>Gender:</FormLabel>
                                        <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={setForm}>
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                                        </RadioGroup>
                                    </FormControl>

                                    <TextField id="dob" label="Date of Birth" name="dob" type="date" defaultValue={dob} className={classes.textField} InputLabelProps={{ shrink: true }} onChange={setForm} style={{ marginTop: "30px" }} />

                                </Card.Body>
                            </Card>

                            <Card style={{ marginTop: "20px" }}>
                                <Card.Header>
                                    <Card.Title style={{ margin: "10px 0 0 10px" }}>
                                        Contact Details
                                    </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <TextField label="Mobile No." name="mobile" value={mobile} onChange={setForm} type="number" style={{ width: 220, marginRight: "20px" }} />

                                    <TextField label="Email" name="email" value={email} onChange={setForm} type="email" style={{ width: 460, marginRight: "20px" }} />
                                </Card.Body>
                            </Card>

                            <Card style={{ marginTop: "20px" }}>
                                <Card.Header>
                                    <Card.Title style={{ margin: "10px 0 0 10px" }}>
                                        College Details
                                    </Card.Title>
                                </Card.Header>

                                <Card.Body>

                                    <FormControl className={classes.formControl} style={{ width: 380, marginRight: "20px" }}>
                                        <InputLabel id="collegeLabel">College</InputLabel>
                                        <Select labelId="collegeLabel" id="college" name="college" value={college} onChange={setForm} >
                                            <MenuItem value="Goa College of Engineering">Goa College of Engineering</MenuItem>
                                            <MenuItem value="Agnel Institute of Technology and Design">Agnel Institute of Technology and Design</MenuItem>
                                            <MenuItem value="Padre Conceicao College of Engineering">Padre Conceicao College of Engineering</MenuItem>
                                            <MenuItem value="Shree Rayeshwar Institute of Engineering and Information Technology">Shree Rayeshwar Institute of Engineering and Information Technology</MenuItem>
                                            <MenuItem value="Don Bosco College of Engineering">Don Bosco College of Engineering</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="departmentLabel">Department</InputLabel>
                                        <Select labelId="departmentLabel" id="department" name="department" value={department} onChange={setForm} >
                                            <MenuItem value="Information Technology">Information Technology</MenuItem>
                                            <MenuItem value="Computer Engineering">Computer Engineering</MenuItem>
                                            <MenuItem value="Electronics and Telecommunication">Electronics and Telecommunication</MenuItem>
                                            <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                                            <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
                                            <MenuItem value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</MenuItem>
                                            <MenuItem value="Mining Engineering">Mining Engineering</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <br />

                                    <TextField label="PR No." name="prNumber" value={prNumber} onChange={setForm} style={{ width: 220, marginRight: "20px", marginTop: "20px" }} />

                                    <FormControl style={{ width: 220, marginTop: "20px", marginRight: "20px" }}>
                                        <InputLabel id="yearLabel">Year</InputLabel>
                                        <Select labelId="yearLabel" id="year" name="year" value={year} onChange={setForm} >
                                            <MenuItem value="First Year">First Year</MenuItem>
                                            <MenuItem value="Second Year">Second Year</MenuItem>
                                            <MenuItem value="Third Year">Third Year</MenuItem>
                                            <MenuItem value="Fourth Year">Fourth Year</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField label="Roll No." name="rollNumber" value={rollNumber} onChange={setForm} style={{ width: 220, marginRight: "20px", marginTop: "20px" }} />
                                </Card.Body>
                            </Card>
                        </Card.Text>
                    </Card.Body>

                    <Card.Footer style={{ textAlign: "center" }}>
                        <Button variant="contained" color="primary" onClick={navigation.next} style={{ marginTop: "20px", marginBottom: "20px" }}>Next</Button>
                    </Card.Footer>

                </Card>
            </Container>
            <br />

            <FooterWV />
        </div>




    );
}

export default PersonalDetails;