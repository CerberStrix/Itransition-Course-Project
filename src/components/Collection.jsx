import React, { useEffect, useState } from 'react'
import { useParams, useHistory, useNavigate } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"
import ItemForm from './ItemForm';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NewCollectionForm from './NewCollectionForm';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';


import Placeholder from '../static/placeholder.png'

function Collection() {
  const nav = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { collectionId } = useParams();

  const [collectionData, setCollectionData] = useState(null);
  const [itemsCollection, setItemsCollection] = useState([])
  

  useEffect(() => {
    const fetchData = async () => {
      const collectionResponse = await axios.get(`https://itransition-my-course-project.herokuapp.com/${collectionId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      const itemsResponse = await axios.get(`https://itransition-my-course-project.herokuapp.com/items/${collectionId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      const collection = collectionResponse.data.collection;
      const fields = collectionResponse.data.collectionFields;
      collection.fields = fields;
      setCollectionData(collectionResponse.data.collection);
      setItemsCollection(itemsResponse.data)
    };
    fetchData()
  }, []);

  const deleteItem = async (targetId) => {
    const response = await axios.delete(`https://itransition-my-course-project.herokuapp.com/items/delete/${targetId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    if (response.data.error) {
      return;
    }
    const newItemsList = itemsCollection.filter(({id}) => id !== targetId);
    setItemsCollection(newItemsList);
  };

  const handleImageUpload = async (image, lastImage) => {
    if (image === lastImage) {
      return image;
    };
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

  const handleState = (fetchData, data) => {
    setCollectionData(data);
  };

  const handleFetch = async (data) => {
    await axios.patch(`https://itransition-my-course-project.herokuapp.com/collection/edit/${collectionId}`, data);
  };

  return (
    <Container> 
      <Row className="mt-4 g-4">
        { collectionData &&
        <>
        <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} xl={{ span: 3 }} className="text-center">
          <Card className=" mx-3">
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
      <Card data-color-mode="light" className=" mx-3">
     
      <MDEditor.Markdown
        style={{ padding: 15, marginTop: "10px" }}
        source={collectionData.description}
        linkTarget="_blank"
      />
      </Card>
      </Col>
      </>
}
    </Row>
    <Row className="mt-3 mx-1">
      <Col>
      <Table striped hover>
      <thead>
        <tr>
          <th>id</th>
          <th>Name</th>
          <th>Added</th>
        </tr>
      </thead>
      <tbody>
      {
         itemsCollection.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{new Date(item.createdAt).toDateString()}</td>
              <td style={{ textAlign: "right"}}>
              <Button variant="primary" size="sm" className="mx-1">
              open
            </Button>
              <Button variant="danger" size="sm" onClick={() => deleteItem(item.id)}>
              delete
            </Button>
          </td>
        </tr> 
          )
        })
      }
        
      </tbody>
    </Table>
      </Col>
    </Row>
    <Row>
      <Col style={{ textAlign: "center"}}>
      { collectionData &&
      <ItemForm collectionData={collectionData} items={itemsCollection} setItems={setItemsCollection}/>
}
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
        <NewCollectionForm state={collectionData} handleClose={handleClose} handleState={handleState} handleFetch={handleFetch} handleImageUpload={handleImageUpload}/>
      </Row>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default Collection
