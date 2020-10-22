import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

function TopMenu({ role, showModal, logout }) {
    const profileBtn = role === ("traine_" || "trainee" || "trainer") ? <Button variant="light" className="mr-4"
        onClick={showModal}>Account Profile <i className="fas fa-user"></i></Button> : ""
    const navLinksFor = {
        admin: [
            <Link key={2} to="/assistant-management" className="nav-link"> Manage assistants </Link>,
            <Link key={3} to="/trainer-management" className="nav-link"> Manage trainers </Link>
        ],
        assistant: [
            <Link key={4} to="/trainer-management" className="nav-link"> Manage trainers </Link>,
            <Link key={5} to="/trainee-management" className="nav-link"> Manage trainees </Link>,
            <Link key={6} to="/program-management" className="nav-link"> Manage training programs </Link>,
            <Link key={7} to="/category-management" className="nav-link"> Manage categories </Link>
        ],
        traine_: "",
        trainee: "",
        trainer: ""
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#">Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {navLinksFor[role]}
                </Nav>
                <Nav>
                    {profileBtn}
                    <Button variant="primary" onClick={logout}> Logout <i className="fas fa-sign-out-alt"></i></Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default TopMenu
