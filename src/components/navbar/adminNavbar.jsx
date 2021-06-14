import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

import logo from '../../images/webvotelogo.png';

import LogoutBtn from '../navbar/logoutBtnComponent';

function AdminNavbar(props) {
    return (
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
                    <Nav className="mr-auto navlinks" style={{ marginLeft: "20px" }}>
                        <Nav.Link style={{ color: "#15784E", marginRight: "10px" }} href="/admin/home">Live Elections</Nav.Link>
                        <Nav.Link style={{ color: "#15784E", marginRight: "10px" }} href="/admin/upcoming">Upcoming Elections</Nav.Link>
                        <Nav.Link style={{ color: "#15784E", marginRight: "10px" }} href="/admin/results">Results</Nav.Link>
                    </Nav>

                    <span className="divider-vertical"></span>

                    <Nav>
                        <Button variant="outline-success" href="/admin/newElection" style={{ marginRight: "10px", marginLeft: "10px" }}>Create New Election</Button>
                        <Button variant="outline-success" href="/admin/register">Register Admin</Button>
                    </Nav>

                    <Nav style={{ marginLeft: "5%" }}>
                        {
                            props.data ?
                                <div style={{ color: "#15784E", fontSize: "18px" }}>
                                    <span style={{ marginRight: "5px", marginTop: "10px" }} className="fa fa-user"></span>
                                    <span style={{ marginRight: "10px" }}>{props.data.username}</span>
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

export default AdminNavbar;