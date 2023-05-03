import React from "react";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'

function NavSec() {
    return(
        <Navbar bg="light" variant="light">
            <Container fluid>
                <Navbar.Brand href="/">Treasure</Navbar.Brand>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/finance/calculator/creditCard/repayment">CC Repayment Calculator</Nav.Link>
                        {/* <NavDropdown title="Finance Services" id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.2" href="/finance/calculator/creditCard/repayment">CC Repayment Calculator</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                        <Button variant="outline-default">Login</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavSec;