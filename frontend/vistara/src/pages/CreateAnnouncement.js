import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaImage, FaTimesCircle, FaPaperPlane, FaArrowLeft, FaFont } from 'react-icons/fa';
import axios from 'axios';
import VoiceCommandButton from '../components/VoiceCommandButton';

const API_URL = 'http://localhost:8080/api';

// Colors for text posts background
const COLOR_OPTIONS = [
  '#1877F2', '#E1306C', '#833AB4', '#FD1D1D',
  '#F56040', '#FFDC80', '#405DE6', '#5851DB',
  '#00c984', '#4267B2',
];

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slots, summary } = location.state || {};

  const [mediaType, setMediaType] = useState('image');
  const [formData, setFormData] = useState({
    content: '',
    startDate: new Date(),
    image: null,
    authorName: 'Current User',
    authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    backgroundColor: COLOR_OPTIONS[0]
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Pre-fill form if coming from chatbot
  useEffect(() => {
    if (summary && slots) {
      setFormData(fd => ({
        ...fd,
        content: summary,
        startDate: new Date(slots.date)
      }));

      console.log('Pre-filling form with:', summary, slots);
    }
  }, [summary, slots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: null }));
  };

  const handleDateChange = (date) => {
    setFormData(fd => ({ ...fd, startDate: date }));
    if (errors.startDate) setErrors(err => ({ ...err, startDate: null }));
  };

  const handleImageChange = (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setErrors(err => ({ ...err, image: 'Image must be <5MB' }));
      return;
    }
    setFormData(fd => ({ ...fd, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setErrors(err => ({ ...err, image: null }));
  };

  const removeImage = () => {
    setFormData(fd => ({ ...fd, image: null }));
    setImagePreview(null);
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    if (type === 'text') removeImage();
  };

  const handleColorSelect = (color) => {
    setFormData(fd => ({ ...fd, backgroundColor: color }));
  };

  const handleVoiceTranscript = (transcript) => {
    setFormData(fd => ({ ...fd, content: transcript }));
    setErrors(err => ({ ...err, content: null }));
  };

  const handleVoiceStart = () => setIsVoiceActive(true);
  const handleVoiceStop = () => setIsVoiceActive(false);

  const validateForm = () => {
    const newErr = {};
    if (!formData.content.trim()) newErr.content = 'Text is required';
    else if (formData.content.length < 10) newErr.content = 'Min 10 characters';
    if (!formData.startDate) newErr.startDate = 'Date is required';
    if (mediaType === 'image' && !formData.image && !imagePreview) {
      newErr.mediaType = 'Upload image or switch to text';
    }
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let imageBase64 = null;
      if (mediaType === 'image' && formData.image) {
        if (imagePreview?.startsWith('data:')) {
          imageBase64 = imagePreview.split(',')[1];
        } else {
          const reader = new FileReader();
          imageBase64 = await new Promise(res => {
            reader.onloadend = () => res(reader.result.split(',')[1]);
            reader.readAsDataURL(formData.image);
          });
        }
      }
      const dto = {
        content: formData.content,
        startDate: formData.startDate.toISOString(),
        image: imageBase64,
        authorName: formData.authorName,
        authorAvatar: formData.authorAvatar,
        backgroundColor: mediaType === 'text' ? formData.backgroundColor : null,
        mediaType
      };
      await axios.post(`${API_URL}/announcements`, dto);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch {
      setErrors(err => ({ ...err, submit: 'Failed to create announcement' }));
    } finally {
      setLoading(false);
    }
  };

  const isValidDate = date => date >= new Date().setHours(0,0,0,0);

  return (
    <Container className="py-3 py-md-4">
      <div className="mb-3">
        <Link to="/" className="btn btn-link p-0">
          <FaArrowLeft className="me-2" /> Back to Home
        </Link>
      </div>
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Success!</Alert.Heading>
          <p>Your announcement has been created. Redirecting…</p>
        </Alert>
      )}
      <Card>
        <Card.Header className="bg-primary text-white">
          <h2 className="fs-5 mb-0">Create New Announcement</h2>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Choose Announcement Type</h5>
            <div className="d-flex gap-3">
              <Button
                variant={mediaType==='image'?'primary':'outline-primary'}
                onClick={()=>handleMediaTypeChange('image')}
              >
                <FaImage className="me-1"/> Image
              </Button>
              <Button
                variant={mediaType==='text'?'primary':'outline-primary'}
                onClick={()=>handleMediaTypeChange('text')}
              >
                <FaFont className="me-1"/> Text
              </Button>
            </div>
            {errors.mediaType && <div className="text-danger mt-1">{errors.mediaType}</div>}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Announcement Text{' '}
                <OverlayTrigger overlay={<Tooltip>Voice input</Tooltip>}>
                  <span className="text-muted">(Voice)</span>
                </OverlayTrigger>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter announcement..."
                  isInvalid={!!errors.content}
                  disabled={isVoiceActive}
                  style={mediaType==='text'?{backgroundColor:formData.backgroundColor,color:'#fff'}:{}}
                />
                <InputGroup.Text>
                  <VoiceCommandButton
                    onTranscript={handleVoiceTranscript}
                    onStart={handleVoiceStart}
                    onStop={handleVoiceStop}
                  />
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.content}
                </Form.Control.Feedback>
              </InputGroup>
              {isVoiceActive && <div className="mt-2">Listening…</div>}
            </Form.Group>

            {mediaType==='text' && (
              <Form.Group className="mb-3">
                <Form.Label>Background Color</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(color=>(
                    <div
                      key={color}
                      onClick={()=>handleColorSelect(color)}
                      style={{
                        backgroundColor: color,
                        width:30, height:30,
                        borderRadius:'50%',
                        cursor:'pointer',
                        border: formData.backgroundColor===color ? '3px solid #000' : '1px solid #ccc'
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label><FaCalendarAlt className="me-1"/> Start Date</Form.Label>
              <DatePicker
                selected={formData.startDate}
                onChange={handleDateChange}
                filterDate={isValidDate}
                className={`form-control ${errors.startDate?'is-invalid':''}`}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
              />
              {errors.startDate && <div className="invalid-feedback d-block">{errors.startDate}</div>}
            </Form.Group>

            {mediaType==='image' && (
              <Form.Group className="mb-3">
                <Form.Label><FaImage className="me-1"/> Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
              </Form.Group>
            )}

            {mediaType==='image' && imagePreview && (
              <Row className="mb-3">
                <Col xs={6}>
                  <div style={{ position:'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight:200, objectFit:'contain' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ position:'absolute', top:5, right:5 }}
                      onClick={removeImage}
                    >
                      <FaTimesCircle />
                    </Button>
                  </div>
                </Col>
              </Row>
            )}

            {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

            <div className="d-flex justify-content-between">
              <Link to="/" className="btn btn-secondary">Cancel</Link>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading
                  ? 'Creating…'
                  : <><FaPaperPlane className="me-1"/> Create Announcement</>
                }
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAnnouncement;
