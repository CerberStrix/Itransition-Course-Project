import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';

const createFormField = (field, state, handleChange, idx) => {
  switch (field.type) {
    case "integer":
      return (
        <React.Fragment key={field.key}>
          <Form.Label className="mt-3">{field.key}</Form.Label>
          <Form.Control
            type="number"
            required
            value={state[idx].value}
            onChange={(e) => handleChange(e, idx)}
          />
        </React.Fragment>
      );
    case "string": {
      return (
        <React.Fragment key={field.key}>
          <Form.Label className="mt-3">{field.key}</Form.Label>
          <Form.Control
            type="text"
            required
            value={state[idx].value}
            onChange={(e) => handleChange(e, idx)}
          />
        </React.Fragment>
      )
    }
    case "text": {
      return (
        <React.Fragment key={field.key}>
          <Form.Label className="mt-3">{field.key}</Form.Label>
          <Form.Control 
          as="textarea" 
          rows={3} 
          required
          value={state[idx].value}
          onChange={(e) => handleChange(e, idx)}
            />
        </React.Fragment>
      )
    }
    case "checkbox": {
      return (
        <React.Fragment key={field.key}>
          <Form.Label className="mt-3">{field.key}</Form.Label>
          <div key={`inline-radio`}>
          <Form.Check
            required
            inline
            label="Yes"
            name="opt"
            type="radio"
            value="yes"
            onChange={(e) => handleChange(e, idx)}
            id={state[idx].value}
          />
          <Form.Check
          required
            inline
            label="No"
            name="opt"
            type="radio"
            value="no"
            onChange={(e) => handleChange(e, idx)}
            id={state[idx].value}
          />
           </div>
           </React.Fragment>
      )
    }
    case "date": {
      return (
        <React.Fragment key={field.key}>
          <Form.Label className="mt-3">{field.key}</Form.Label>
          <Form.Control 
            type="date"
            required
            value={state[idx].value}
            onChange={(e) => handleChange(e, idx)}
            />
       </React.Fragment>
      )
    }
    default: {
      return
    }
  }
}

const getFieldsState = (fields) => {
  let state = [];
  fields.map((field) => {
    const key = field.name;
    const type = field.type;
    const value = '';
    state.push({ key, value, type });
  })
  return state;
  
}

function ItemForm({ collectionData, items, setItems}) {

  const [tagList, setTag] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://itransition-my-course-project.herokuapp.com/tags/get", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    return response.data;
    };

    fetchData().then((data) => setTag(data))
 
  }, [])

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setItemName('');
    setState(getFieldsState(collectionData.fields))
    setTags([])
    setValidated(false);
  }
  
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const [state, setState] = useState(getFieldsState(collectionData.fields))
  const [itemName, setItemName] = useState('');
  const [tags, setTags] = useState([])

  
  const changeState = (e, idx) => {
    const newState = [...state];
    newState[idx].value = e.target.value
    setState(newState)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      const collId = collectionData.id;
      const response = await axios.post(`https://itransition-my-course-project.herokuapp.com/items/createItem`, { itemName, state, tags, collId }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      setValidated(false);
      setItems([...items, response.data])
      
      handleClose()
    }
    
  };

  return (
    <div>
      <>
      <Button variant="primary" onClick={handleShow}>
        Create item
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
      <Form.Label className="mt-3">Name</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setItemName(e.target.value)}
          />
      {state.map((field, idx) => createFormField(field, state, changeState, idx))}
      </Form.Group>
      <div className="text-center mt-3">
      <Button type="submit" className="mx-2">Create</Button>
      <Button variant="secondary" className="mx-2" onClick={handleClose}>
            Close
          </Button>
          </div>
    </Form>
    </Container>
        </Modal.Body>
      </Modal>
    </>
    </div>
  )
}

export default ItemForm
