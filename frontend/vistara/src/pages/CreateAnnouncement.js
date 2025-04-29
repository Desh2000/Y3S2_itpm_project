import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaImage, FaTimesCircle, FaPaperPlane, FaArrowLeft, FaFont } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VoiceCommandButton from '../components/VoiceCommandButton';

const API_URL = 'http://localhost:8080/api';

// Colors for text posts background
const COLOR_OPTIONS = [
  '#1877F2', // Facebook blue
  '#E1306C', // Instagram pink
  '#833AB4', // Instagram purple
  '#FD1D1D', // Instagram red
  '#F56040', // Instagram orange
  '#FFDC80', // Instagram yellow
  '#405DE6', // Instagram indigo
  '#5851DB', // Instagram violet
  '#00c984', // Green
  '#4267B2', // Facebook classic blue
];

const CreateAnnouncement = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size must be less than 5MB'
        });
        return;
      }
      
      setFormData({
        ...formData,
        image: selectedFile
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear error if any
      if (errors.image) {
        setErrors({
          ...errors,
          image: null
        });
      }
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
  };

  const handleMediaTypeChange = (type) => {
    console.log("Changing media type to:", type);
    setMediaType(type);
    
    if (type === 'text') {
      removeImage();
    }
  };

  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      backgroundColor: color
    });
  };

  const handleVoiceTranscript = (transcript) => {
    // Update the content with the transcript
    setFormData({
      ...formData,
      content: transcript
    });

    // Clear error if any
    if (errors.content) {
      setErrors({
        ...errors,
        content: null
      });
    }
  };

  const handleVoiceStart = () => {
    setIsVoiceActive(true);
  };

  const handleVoiceStop = () => {
    setIsVoiceActive(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors.content = 'Announcement text is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Announcement text should be at least 10 characters';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (mediaType === 'image' && !formData.image && !imagePreview) {
      newErrors.mediaType = 'Please upload an image or switch to text mode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      let imageBase64 = null;
      
      // Convert image to base64 if exists and it's an image type
      if (mediaType === 'image' && formData.image) {
        // If the image is already a base64 string (from preview), use it directly
        if (typeof imagePreview === 'string' && imagePreview.startsWith('data:')) {
          // Extract the base64 part without the data:image/xxx;base64, prefix
          imageBase64 = imagePreview.split(',')[1];
        } else {
          // Otherwise read the file as base64
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve) => {
            reader.onloadend = () => {
              const base64String = reader.result;
              resolve(base64String.split(',')[1]); // Remove the data:image/xxx;base64, prefix
            };
            reader.readAsDataURL(formData.image);
          });
        }
      }
      
      // Create announcement DTO to send to backend
      const announcementData = {
        content: formData.content,
        startDate: formData.startDate.toISOString(),
        image: imageBase64,
        authorName: formData.authorName,
        authorAvatar: formData.authorAvatar,
        backgroundColor: mediaType === 'text' ? formData.backgroundColor : null,
        mediaType: mediaType
      };
      
      // Send to API
      const response = await axios.post(`${API_URL}/announcements`, announcementData);
      
      console.log('Announcement created:', response.data);
      
      setShowSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating announcement:', error);
      setErrors({
        ...errors,
        submit: 'Failed to create announcement. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Ensuring no past dates can be selected
  const isValidDate = (date) => {
    return date >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  useEffect(() => {
    console.log("Current media type:", mediaType);
  }, [mediaType]);

  return (
    <Container className="py-3 py-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-link text-decoration-none p-0">
          <FaArrowLeft className="me-2" /> Back to Home
        </Link>
      </div>
      
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Success!</Alert.Heading>
          <p>Your announcement has been created successfully! Redirecting to home page...</p>
        </Alert>
      )}
      
      <Card className="form-container">
        <Card.Header className="bg-primary text-white py-2 py-md-3">
          <h2 className="form-title mb-0 fs-4 fs-md-3">Create New Announcement</h2>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {/* Media type selector - OUTSIDE the form */}
          <div className="mb-4">
            <h5 className="mb-3">Choose Announcement Type</h5>
            <div className="d-flex gap-3">
              <button 
                type="button"
                className={`btn ${mediaType === 'image' ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                onClick={() => handleMediaTypeChange('image')}
              >
                <FaImage className="me-2" /> Image
              </button>
              
              <button 
                type="button"
                className={`btn ${mediaType === 'text' ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                onClick={() => handleMediaTypeChange('text')}
              >
                <FaFont className="me-2" /> Text
              </button>
            </div>
            {errors.mediaType && (
              <div className="text-danger mt-2">
                {errors.mediaType}
              </div>
            )}
          </div>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Announcement Text
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Click the microphone to use voice input</Tooltip>}
                >
                  <span className="ms-2 text-muted">(Voice input available)</span>
                </OverlayTrigger>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter your announcement text..."
                  isInvalid={!!errors.content}
                  disabled={isVoiceActive}
                  className={`${isVoiceActive ? 'voice-active-textarea' : ''}`}
                  style={mediaType === 'text' ? { backgroundColor: formData.backgroundColor, color: '#fff' } : {}}
                />
                <InputGroup.Text
                  className="voice-command-wrapper"
                  style={mediaType === 'text' ? { backgroundColor: formData.backgroundColor, borderColor: formData.backgroundColor } : {}}
                >
                  <VoiceCommandButton
                    onTranscript={handleVoiceTranscript}
                    onStart={handleVoiceStart}
                    onStop={handleVoiceStop}
                    size="sm"
                    variant={mediaType === 'text' ? 'light' : 'primary'}
                    showAssistantPopup={true}
                  />
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.content}
                </Form.Control.Feedback>
              </InputGroup>
              {isVoiceActive && (
                <div className="voice-status recording mt-2">
                  Listening... Speak clearly into your microphone
                </div>
              )}
              <Form.Text className="text-muted">
                Write a clear and informative announcement (min. 10 characters)
              </Form.Text>
            </Form.Group>

            {/* Background color selector for text type */}
            {mediaType === 'text' && (
              <Form.Group className="form-group">
                <Form.Label>Background Color</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color, index) => (
                    <div 
                      key={index} 
                      className={`color-option ${formData.backgroundColor === color ? 'border border-3 border-primary' : ''}`} 
                      style={{ 
                        backgroundColor: color, 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </Form.Group>
            )}

            <Form.Group className="form-group">
              <Form.Label>
                <FaCalendarAlt className="me-2" /> Start Date
              </Form.Label>
              <div className="w-100">
                <DatePicker
                  selected={formData.startDate}
                  onChange={handleDateChange}
                  filterDate={isValidDate}
                  className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  required
                />
              </div>
              {errors.startDate && (
                <div className="invalid-feedback d-block">
                  {errors.startDate}
                </div>
              )}
              <Form.Text className="text-muted">
                You cannot select a past date
              </Form.Text>
            </Form.Group>

            {/* Image upload only for image type */}
            {mediaType === 'image' && (
              <Form.Group className="form-group">
                <Form.Label>
                  <FaImage className="me-2" /> Upload Image
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                </Form.Text>
              </Form.Group>
            )}

            {/* Image preview only for image type */}
            {mediaType === 'image' && imagePreview && (
              <Row className="mb-3">
                <Col xs={12} md={8} lg={6}>
                  <div className="position-relative image-preview-container">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid rounded image-preview" 
                      style={{ maxHeight: '200px', objectFit: 'contain' }} 
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 m-2 rounded-circle p-1"
                      onClick={removeImage}
                    >
                      <FaTimesCircle />
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
            
            {/* Text preview for text type */}
            {mediaType === 'text' && formData.content && (
              <Row className="mb-3">
                <Col xs={12}>
                  <div 
                    className="text-preview p-3 rounded"
                    style={{ 
                      backgroundColor: formData.backgroundColor,
                      color: '#fff',
                      minHeight: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {formData.content}
                  </div>
                </Col>
              </Row>
            )}
            
            {errors.submit && (
              <Alert variant="danger" className="mt-3">
                {errors.submit}
              </Alert>
            )}

            <div className="d-flex flex-column flex-md-row justify-content-between mt-4 gap-2 gap-md-0">
              <Link to="/" className="btn btn-secondary mb-2 mb-md-0">
                Cancel
              </Link>
              <Button 
                type="submit" 
                variant="primary" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Create Announcement
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAnnouncement; 