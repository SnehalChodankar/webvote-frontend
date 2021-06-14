import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import logo from '../../images/webvotelogo.png';

import LogoutBtn from '../navbar/logoutBtnComponent';

function VoterNavbar(props) {
    return (
        <div className="shadow">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">
                    <img src={logo} width="40" style={{ marginRight: "10px", marginLeft: "15px", marginBottom: "5px" }} alt="WebVote Logo" />
                    <label style={{ color: "#15784E", fontWeight: "bold", fontSize: "xx-large" }}>
                        <span style={{ color: "#2F4C58" }}>Web</span>
                        <span style={{ color: "#4999B8" }}>Vote</span>
                    </label>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto navlinks offset-3">
                        <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/voter/home">Live Elections</Nav.Link>
                        <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/voter/upcoming">Upcoming Elections</Nav.Link>
                        <Nav.Link style={{ color: "#15784E", marginRight: "15px" }} href="/voter/results">Results</Nav.Link>
                    </Nav>

                    <Nav style={{ marginLeft: "60px" }}>
                        {
                            props.data ?
                                <div style={{ color: "#15784E", fontSize: "18px" }}>
                                    <span style={{ marginRight: "5px", marginTop: "10px" }} className="fa fa-user"></span>
                                    Hello {props.data.firstname}, <span style={{ marginRight: "10px" }}>{props.data.prNumber}</span>
                                </div>
                                : null
                        }

                        <LogoutBtn />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default VoterNavbar;