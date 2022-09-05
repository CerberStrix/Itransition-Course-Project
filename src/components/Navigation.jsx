import React from 'react'
import {
  Link, useNavigate
} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../hooks';


const buttonMapping = {
  guest: (auth, navigate) => {
    return (
      <>
        <Nav.Link disabled>Личная страница</Nav.Link>
        <NavDropdown align="end" title="Гость" id="navbarScrollingDropdown">
          <NavDropdown.Item onClick={ () => navigate("./login")}>Войти</NavDropdown.Item>
          </NavDropdown>
        </>
    )
  },
  user: (auth) => {
    return (
      <>
        <Nav.Link as={Link} to="/user">Личная страница</Nav.Link>
        <NavDropdown align="end" title={auth.authState.name} id="navbarScrollingDropdown">
          <NavDropdown.Item onClick={auth.logOut}>Выйти</NavDropdown.Item>
          </NavDropdown>
        </>
    )
  },
  admin: (auth) => {
    return (
      <>
        <Nav.Link as={Link} to="/user">Панель администратора</Nav.Link>
        <NavDropdown align="end" title={auth.authState.name} id="navbarScrollingDropdown">
          <NavDropdown.Item onClick={auth.logOut}>Выйти</NavDropdown.Item>
          </NavDropdown>
        </>
    )
  },
};

const AuthButton = (navigate) => {
  const auth = useAuth();
  return buttonMapping[auth.authState.permission](auth, navigate);
};

function Navigation() {
  let navigate = useNavigate();
  return (
    <Navbar bg="ligth" variant="light" expand="lg" className='navbar-space'>
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '160px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/home">Домой</Nav.Link>
            {AuthButton(navigate)}
          </Nav>
          
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <NavDropdown style={{ float: 'right', marginLeft: '20px' }} align="end" className="my-2 my-lg-0 " title="Язык" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Русский</NavDropdown.Item>
              <NavDropdown.Item href="#action3">Узбекский</NavDropdown.Item>
   
            </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
