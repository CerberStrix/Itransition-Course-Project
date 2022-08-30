import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {
  return (
    <div>
      <Container>
      <Row className="justify-content-md-center">
        <Col sm="6">
          <div>MOST BIGGEST</div>
        </Col>
        <Col sm="6">
        <div>LAST ADDED</div>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Home
