import React from "react";
import '../page/Home.css';
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Link } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="navigation">
            <Navbar expand="lg" fixed="top">
                <Navbar.Brand className="mx-4" as={Link} to={"/"}>Nova Restaurant</Navbar.Brand>
                <Navbar.Toggle className="mx-4" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to={"/"}>Strona Główna</Nav.Link>
                        <Nav.Link as={Link} to={"/menu"}>Menu</Nav.Link>
                        <Nav.Link as={Link} to={"/rezerwacja"}>Rezerwacja</Nav.Link>
                        <Nav.Link as={Link} to={"/organizacja-imprez"}>Organizacja imprez</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Navigation;