import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import MDEditor from "@uiw/react-md-editor";

import { useAuth } from '../hooks';


import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import CloseButton from 'react-bootstrap/CloseButton';
import Placeholder from '../static/placeholder.png'

import Button from 'react-bootstrap/Button';

const collectionOptions = [
  { value: 'books', label: 'Books' },
  { value: 'comics', label: 'Comics' },
  { value: 'games', label: 'Games' },
];

const fieldsOptions = [
  { value: 'integer', label: 'Numbers' },
  { value: 'string', label: 'String' },
  { value: 'text', label: 'Text' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
];

const defaultState = {
    name: '',
    theme: '',
    description: '',
    imageUrl: "empty",
    imageError: null,
    fields: [],
};

const collectionSchema = yup.object().shape({
  name: yup.string().min(3).max(25).required(),
  theme: yup.string().required(),
});

const secFieldsSchema = yup.object().shape({
  name: yup.string().min(3).max(15).required(),
  type: yup.string().required(),
});

function NewCollectionForm({handleClose, handleState, handleFetch, handleImageUpload, state = defaultState }) {

  const { authState } = useAuth();
  const inputRef = useRef(null);

  const [description, setDescription] = useState(state.description);
  const [fields, setFields] = useState(state.fields);
  const [imagePreview, setImgPreview] = useState(state.imageUrl);
  const [imageError, setImgError] = useState(state.imageError);
  const [imageUpload, setImageUpload] = useState(state.imageUrl);
  const [prevImg, setPrevImg] = useState(state.imageUrl);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpeg"];
    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result)
      };
      reader.readAsDataURL(selected)
      setImageUpload(selected)
      setImgError(false)
    } else {
      setImageUpload(null)
      setImgError(true)
    }
  }

  const removeImage = (e) => {
    setImgPreview("empty");
    setImageUpload(null);
    setPrevImg(imageUpload);
    e.target.value = null;

  }
  const deleteField = (delName) => {
    const newFields = fields.filter(({ name }) => name !== delName);
    setFields(newFields);
  };

  const handleSubmitForm = async ({ name, theme }) => {
    const url = await handleImageUpload(imageUpload, prevImg)
    const collectionData = {
      UserId: authState.id,
      name: name,
      theme: theme,
      description: description,
      imageUrl: url,
      fields: fields,
    } 
    const data = await handleFetch(collectionData);
    handleState(data, collectionData);
    handleClose()
  }

  return (
    <Container>
        <Row >
              <Col xs={{ span: 12 }} sm={{ span: 6 }} xl={{ span: 4 }}>
              <div className="imagePreview" style={{
                background: imagePreview !== "empty" ? `url("${imagePreview}") no-repeat center/cover` : `url("${Placeholder}") no-repeat center/cover`
              }}>
            </div>
    <Formik
      validationSchema={collectionSchema}
      onSubmit={handleSubmitForm}
      initialValues={{
        name: state.name,
        theme: state.theme,
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
      }) => (
        <Form onSubmit={handleSubmit} className="registrationForm" id="majorForm">
              <Form.Group className="formGroup">
              <Form.Label className="mt-3">Image</Form.Label>
              { imagePreview !== "empty" &&  <Row className="mx-0"><Button variant="secondary" size="sm" onClick={removeImage}>
          Remove image
        </Button></Row>}
              {
                imagePreview === "empty" && 
                <> <Form.Control
                type="file"
                key=''
                onChange={handleImageChange}
                isInvalid={imageError}
              />
                <Form.Control.Feedback type="invalid">
                {"File not supported"}
              </Form.Control.Feedback>
              </>
              }
           
            <Form.Label className="mt-3">Collection name</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="Enter name"
              name="name"
              value={values.name}
              onChange={handleChange}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>

            <Form.Label className="mt-3">Theme</Form.Label>
            <Form.Select
              name="theme"
              value={values.theme}
              onChange={handleChange}
              isInvalid={touched.theme && !!errors.theme}>
                <option value="">Choose colletion theme</option>
                {collectionOptions.map((theme, i) => {
                  return (
                    <option key={i} value={theme.value}>{theme.label}</option>
                  )
                })}
            </Form.Select>
            
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.theme}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      )}
    </Formik>

    <Formik
      validationSchema={secFieldsSchema}
      onSubmit={(data, {resetForm}) => {
        setFields([...fields, data]);
        resetForm( {values: ''})
      }}
      initialValues={{
        name: '',
        type: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleReset,
        values,
        touched,
        errors,
      }) => (
        <Form onSubmit={handleSubmit} className="registrationForm" id='fieldsForm'>
      
            <Row className="mt-3">
            <Form.Label>New field</Form.Label>
            <Col xs={{ span: 6 }} sm={{ span: 6 }}>
            
            <Form.Control
              type="text"
              placeholder="Field name"
              name="name"
              value={values.name}
              onChange={handleChange}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
              </Col>
              <Col xs={{ span: 6 }} sm={{ span: 6 }}>
              <Form.Select
              name="type"
              value={values.type}
              onChange={handleChange}
              isInvalid={touched.type && !!errors.type}>
                <option value="">Choose field type</option>
                {fieldsOptions.map((type, i) => {
                  return (
                    <option key={i} value={type.value}>{type.label}</option>
                  )
                })}
            </Form.Select>
            
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
                </Col>

          </Row>
          <Row className="mx-0">

          <button type="submit" className="btn btn-primary btn-block mt-2 " form="fieldsForm"> Add field! </button>
          
          </Row>
         
        </Form>
      )}
    </Formik>
    </Col>
    <Col xs={{ span: 12 }} sm={{ span: 6 }} xl={{ span: 7 }}>
    <label className="mt-3">Fields</label>
          <ListGroup className="mt-2 ">
            {fields.map((field, i) => {
              return (
                <ListGroup.Item key={i} className="d-flex justify-content-between align-items-start">
                 <div >
                  <div className="fw-bold">{field.name}</div>
                    <span>тип:</span> <Badge bg="primary">{field.type}</Badge>
                </div>
                <CloseButton onClick={() => {deleteField(field.name)}} className="my-auto"/>
              </ListGroup.Item>
              )
            })}
    </ListGroup>

    </Col>
    </Row>
    <Row>
              <Col xs={{ span: 12 }} sm={{ span: 12 }}>
              <div data-color-mode="light">
          <Form.Label className="mt-3">Description</Form.Label>
        <MDEditor height={300} value={description} onChange={setDescription} />
      </div>

                </Col>
                </Row>
                <div className="text-center mt-3">
                <button type="submit" className="btn btn-primary btn-block mx-2" form="majorForm"> Go! </button>
                <button className="btn btn-danger btn-block mx-2" onClick={handleClose}> Close </button>
                </div>
            
    </Container>
  );
}

export default NewCollectionForm;