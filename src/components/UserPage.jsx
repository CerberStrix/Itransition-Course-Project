import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"
import { v4 } from 'uuid';



import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NewCollectionForm from './NewCollectionForm';
import Card from 'react-bootstrap/Card';

import Placeholder from '../static/placeholder.png'



function UserPage() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [collectionList, setCollectionList] = useState([]);

  const handleState = (data) => {
    setCollectionList([...collectionList, data]);
  };

  const handleFetch = async (data) => {
    const response = await axios.post('https://itransition-my-course-project.herokuapp.com/collection/createCollection', data);
    return response.data
  };

  const handleImageUpload = async (image) => {
    let url = 'empty';
    if (image) {
      const imageRef = ref(storage, `images/${image.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, image);
      url = await getDownloadURL(snapshot.ref);
    }
    return url;
  }

  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://itransition-my-course-project.herokuapp.com/collection/byuser", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setCollectionList(response.data);
    }
    fetchData()
    
  }, []);

  const handleClick = (id) => {
    navigate(`/user/${id}`, { replace: true });
  }

  const deleteCollection = async (targetId, imageUrl) => {
    try {
      await axios.delete(`https://itransition-my-course-project.herokuapp.com/collection/delete/${targetId}`);
      const desertRef = ref(storage, imageUrl);
      await deleteObject(desertRef)
      const filteredCollections = collectionList.filter(({ id }) => id !== targetId);
      setCollectionList(filteredCollections)
    } catch {
      return;
    }
  };
 
  return (
    <Container>

    <Row>
      <Col xs={{ span: 12 }} sm={{ span: 12 }} xl={{ span: 12 }} className="text-center">
      
      <h2 className="mt-5 g-4" style={{ textAlign: 'center' }}>My Collections</h2>
      <Button className="mt-2" variant="primary" onClick={handleShow}>
        Создать коллекцию
      </Button>
      <Row className="mt-5 g-4">
      {collectionList.map((collection) => {
        const date = new Date(collection.createdAt).toDateString();
        const url = collection.imageUrl === "empty" ? Placeholder : `${collection.imageUrl}`;
        return (
        <Col key={collection.id} xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} xl={{ span: 3 }}>
          <Card className="my-3 mx-3">
            <Card.Img variant="top" src={url} />
            <Card.Body>
              <p style={{ textAlign: 'center' }}>Дата: {date}</p>
              <Card.Title style={{size: "10rem"}}>{collection.name}</Card.Title>
              <Card.Text>
                Theme: {collection.theme}
              </Card.Text>
              <Button variant="primary" size="sm" className="mx-1" onClick={() => handleClick(collection.id)}>
        Открыть
      </Button>
      <Button variant="outline-danger" size="sm" onClick={() => deleteCollection(collection.id, collection.imageUrl)}>
        Удалить
      </Button>
            </Card.Body>
          </Card>
        </Col>
      )}
      )}
    </Row>
      </Col>
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
        <NewCollectionForm handleClose={handleClose} handleState={handleState} handleFetch={handleFetch} handleImageUpload={handleImageUpload} />
      </Row>
        </Modal.Body>
        
      </Modal>
       
    
    </Container>
  )
}

export default UserPage
