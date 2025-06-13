import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const CreateEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    category: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    contactNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!event.name.trim()) newErrors.name = 'Event Name is required';
    else if (event.name.length < 3) newErrors.name = 'Must be at least 3 characters';
    else if (event.name.length > 100) newErrors.name = 'Cannot exceed 100 characters';

    if (!event.category.trim()) newErrors.category = 'Category is required';
    else if (event.category.length < 3) newErrors.category = 'Must be at least 3 characters';
    else if (event.category.length > 50) newErrors.category = 'Cannot exceed 50 characters';

    if (!event.startDateTime) newErrors.startDateTime = 'Start Date & Time is required';
    else {
      const start = new Date(event.startDateTime);
      if (isNaN(start.getTime())) newErrors.startDateTime = 'Invalid date';
      else if (start <= new Date()) newErrors.startDateTime = 'Must be in the future';
    }

    if (!event.endDateTime) newErrors.endDateTime = 'End Date & Time is required';
    else {
      const end = new Date(event.endDateTime);
      const start = new Date(event.startDateTime);
      if (isNaN(end.getTime())) newErrors.endDateTime = 'Invalid date';
      else if (end <= start) newErrors.endDateTime = 'Must be after start time';
    }

    if (!event.location.trim()) newErrors.location = 'Location is required';
    else if (event.location.length < 3) newErrors.location = 'Must be at least 3 characters';
    else if (event.location.length > 100) newErrors.location = 'Cannot exceed 100 characters';

    if (!event.description.trim()) newErrors.description = 'Description is required';
    else if (event.description.length < 10) newErrors.description = 'Must be at least 10 characters';
    else if (event.description.length > 500) newErrors.description = 'Cannot exceed 500 characters';

    const phoneRegex = /^(?:\+94\d{9}|0\d{9})$/;
    if (!event.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required';
    else if (!phoneRegex.test(event.contactNumber)) newErrors.contactNumber = 'Invalid format';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!event.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(event.email)) newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const eventToSubmit = {
          ...event,
          startDateTime: new Date(event.startDateTime).toISOString(),
          endDateTime: new Date(event.endDateTime).toISOString()
        };
        await axios.post('http://localhost:8080/api/events', eventToSubmit);
        alert('Event created successfully!');
        navigate('/view-event');
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
      }
    } else {
      alert('Please correct the errors before submitting.');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Create New Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={event.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={event.category}
            onChange={handleChange}
            isInvalid={!!errors.category}
          />
          <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="startDateTime" className="mb-3">
              <Form.Label>Start Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDateTime"
                value={event.startDateTime}
                onChange={handleChange}
                min={getMinDateTime()}
                isInvalid={!!errors.startDateTime}
              />
              <Form.Control.Feedback type="invalid">{errors.startDateTime}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="endDateTime" className="mb-3">
              <Form.Label>End Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDateTime"
                value={event.endDateTime}
                onChange={handleChange}
                min={event.startDateTime || getMinDateTime()}
                isInvalid={!!errors.endDateTime}
              />
              <Form.Control.Feedback type="invalid">{errors.endDateTime}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="location" className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={event.location}
            onChange={handleChange}
            isInvalid={!!errors.location}
          />
          <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={4}
            value={event.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="contactNumber" className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="contactNumber"
            value={event.contactNumber}
            onChange={handleChange}
            isInvalid={!!errors.contactNumber}
          />
          <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email" className="mb-4">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={event.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button type="submit" variant="primary">Submit</Button>
          <Button variant="secondary" onClick={() => navigate('/view-event')}>Cancel</Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateEvent;