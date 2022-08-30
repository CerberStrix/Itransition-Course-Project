import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NewCollectionForm from './NewCollectionForm';
import Card from 'react-bootstrap/Card';

import Placeholder from '../static/placeholder.png'

function Collection() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { collectionId } = useParams();

  const [collectionData, setCollectionData] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://itransition-my-course-project.herokuapp.com/${collectionId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      const collection = response.data.collection;
      const fields = response.data.collectionFields;
      collection.fields = fields;
      console.log(response.data.collection)
      setCollectionData(response.data.collection);
    };
    fetchData().then(console.log(collectionData))
    
    
  }, []);

  const handleImageUpload = async (image, lastImage) => {
    
    let url = 'empty';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      url = await getDownloadURL(snapshot.ref);
    }

    if (!image && lastImage) {
      const desertRef = ref(storage, lastImage);
      await deleteObject(desertRef)
    }
    return url;
  }
  
  const handleState = (data) => {
    setCollectionData(data);
  };

  const handleFetch = async (data) => {
    await axios.patch(`http://localhost:3001/collection//edit/${collectionId}`, data);
    
  };

  return (
    <Container> 
      <Row className="mt-5 g-4">
        { collectionData &&
        <>
        <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} xl={{ span: 3 }} className="text-center">
          <Card className="my-3 mx-3">
            <Card.Img variant="top" src={collectionData.imageUrl === "empty" ? Placeholder : `${collectionData.imageUrl}`} />
            <Card.Body>
              <p style={{ textAlign: 'center' }}>Дата: {new Date(collectionData.createdAt).toDateString()}</p>
              <Card.Title style={{size: "10rem"}}>{collectionData.name}</Card.Title>
              <Card.Text>
                Theme: {collectionData.theme}
              </Card.Text>
              <Button variant="primary" size="sm" className="mx-1" onClick={handleShow}>
        Изменить
      </Button>
            </Card.Body>
          </Card>
        </Col>
      <Col>
      <div data-color-mode="light">
      <MDEditor.Markdown
        style={{ padding: 15, marginTop: "10px" }}
        source={collectionData.description}
        linkTarget="_blank"
        // previewOptions={{
        //   linkTarget: "_blank"
        // }}
      />
      </div>
      </Col>
      </>
}
    </Row>

    <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Создаем коллекцию...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <Row>
        <NewCollectionForm state={collectionData} handleClose={handleClose} handleState={handleState} handleFetch={handleFetch} handleImageUpload={handleImageUpload}/>
      </Row>
        </Modal.Body>
      
      </Modal>
    </Container>
  )
}

export default Collection
