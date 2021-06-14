import React from 'react';
import { Navbar, Nav, Card } from 'react-bootstrap';

import logo from '../../../../images/webvotelogo.png';

import FooterWV from '../../../common/footerComponent';

import { Container, Button, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function Credentials({ formData, setForm, navigation }) {

    const { prNumber, password, walletAddress, privateKey } = formData;

    const [value, setValues] = React.useState({
        showPassword: false
    });

    const handleClickShowPassword = () => {
        setValues({ showPassword: !value.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                                <li className="active">Credentials</li>
                                <li>Summary</li>
                            </ul>
                        </Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Card.Text style={{ marginTop: "20px", padding: "0 50px 0 50px" }}>
                            <Card>
                                <Card.Header>
                                    <Card.Title style={{ margin: "10px 0 0 10px" }}>
                                        Set Credentials
                                </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <TextField disabled label="Username" defaultValue={prNumber} style={{ width: 220, marginRight: "20px", marginTop: "20px" }} />

                                    <FormControl style={{ width: 220, marginRight: "20px", marginTop: "20px" }}>
                                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            type={value.showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={password}
                                            onChange={setForm}

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

                                </Card.Body>
                            </Card>

                            <Card style={{ marginTop: "20px" }}>
                                <Card.Header>
                                    <Card.Title style={{ margin: "10px 0 0 10px" }}>
                                        Crypto Wallet Credentials
                                </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <TextField name="walletAddress" disabled label="Wallet Address" defaultValue={walletAddress} style={{ width: 400, marginRight: "20px", marginTop: "20px" }} />

                                    <TextField name="privateKey" disabled label="Private Key" defaultValue={privateKey} style={{ width: 600, marginRight: "20px", marginTop: "20px" }} />
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

export default Credentials;