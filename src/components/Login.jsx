import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login() {
  const auth = useAuth();
  const { logIn } = auth
  const nav = useNavigate();
  const [errors, setErrors] = useState(false);

  const goToReg = () => {
    nav('/Registration');
  };
  const login = (data) => {
    axios.post('https://itransition-my-course-project.herokuapp.com/authentification//authentification/login', data).then((response) => {
      if (response.data.error) {
        setErrors(response.data.error);
      } else {
        logIn(response.data);
        nav('/');
      }
    });
  };

  return (    
        <Formik
      onSubmit={(data) => {
        login(data);
      }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
      }) => (
        
        <Form onSubmit={handleSubmit} className="formLogin">
  <Container>
    <Row>
      <Col xs={{ span: 6, offset: 3 }} sm={{ span: 4, offset: 4 }}>
      <h1 style={{ textAlign: 'center' }}>Log In</h1>
        </Col>
    </Row>
    <Row>
      <Col xs={{ span: 6, offset: 3 }} sm={{ span: 4, offset: 4 }}>
      <Form.Group controlId="validationFormik01" className="formGroup">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />      
          </Form.Group>
        </Col>
    </Row>
    <Row>
      <Col xs={{ span: 6, offset: 3 }} sm={{ span: 4, offset: 4 }}>
      <Form.Group controlId="validationFormik03" className="formGroup">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
    </Row>
    <Row>
      <Col xs={{ span: 6, offset: 3 }} sm={{ span: 4, offset: 4 }}>
      <div style={{ textAlign: 'center' }}>{errors}</div>
        </Col>
    </Row>
    <Row>
      <Col xs={{ span: 6, offset: 3 }} sm={{ span: 4, offset: 4 }}>
      <button type="submit" className={errors ? 'btn btn-primary btn-block disabled' : 'btn btn-primary btn-block'}> Go! </button>
        </Col>
    </Row>
          <div type="button" onClick={() => { goToReg(); }} style={{ textAlign: 'center' }}>Don't have account? </div>   
          </Container>
        </Form>    
      )}
    </Formik>
  );
}

export default Login;
