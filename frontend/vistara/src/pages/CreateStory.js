import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaVideo, FaFont, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import './CreateStory.css';

const API_URL = 'http://localhost:8080/api';

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

const CreateStory = () => {
  const navigate = useNavigate();
  const [storyType, setStoryType] = useState('image');
  const [mediaContent, setMediaContent] = useState('');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(COLOR_OPTIONS[0]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Current user info - would normally come from auth context
  const currentUser = {
    name: 'Current User',
    avatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaContent(reader.result);
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (storyType !== 'text' && !mediaContent) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const storyData = {
        mediaContent: storyType === 'text' ? null : mediaContent,
        caption,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        backgroundColor: storyType === 'text' ? backgroundColor : null,
        mediaType: storyType
      };
      
      const response = await axios.post(`${API_URL}/stories`, storyData);
      
      setSuccess('Story created successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Failed to create story. Please try again.');
      
      // For development - navigate anyway after showing error
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="create-story-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="mb-3">
            <Link to="/" className="text-decoration-none text-dark back-link">
              <FaArrowLeft className="me-2" /> Back to Home
            </Link>
          </div>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Create a Story</h5>
            </Card.Header>
            
            <Card.Body>
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              {success && (
                <Alert variant="success">{success}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Story type selector */}
                <Form.Group className="mb-4">
                  <Form.Label>Story Type</Form.Label>
                  <div className="story-type-selector">
                    <Button 
                      type="button"
                      variant={storyType === 'image' ? 'primary' : 'outline-primary'} 
                      className="story-type-btn"
                      onClick={() => setStoryType('image')}
                    >
                      <FaImage className="mb-2" size={20} />
                      <span>Image</span>
                    </Button>
                    
                    <Button 
                      type="button"
                      variant={storyType === 'video' ? 'primary' : 'outline-primary'} 
                      className="story-type-btn"
                      onClick={() => setStoryType('video')}
                    >
                      <FaVideo className="mb-2" size={20} />
                      <span>Video</span>
                    </Button>
                    
                    <Button 
                      type="button"
                      variant={storyType === 'text' ? 'primary' : 'outline-primary'} 
                      className="story-type-btn"
                      onClick={() => setStoryType('text')}
                    >
                      <FaFont className="mb-2" size={20} />
                      <span>Text</span>
                    </Button>
                  </div>
                </Form.Group>
                
                {/* Media upload for image/video */}
                {(storyType === 'image' || storyType === 'video') && (
                  <Form.Group className="mb-4">
                    <Form.Label>
                      {storyType === 'image' ? 'Upload Image' : 'Upload Video'}
                    </Form.Label>
                    
                    <div className="upload-container">
                      {previewUrl ? (
                        <div className="preview-container">
                          {storyType === 'image' ? (
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="media-preview" 
                            />
                          ) : (
                            <video 
                              src={previewUrl} 
                              controls 
                              className="media-preview" 
                            />
                          )}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="remove-preview-btn"
                            onClick={() => {
                              setMediaContent('');
                              setPreviewUrl('');
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="upload-box">
                          <input
                            type="file"
                            id="file-upload"
                            className="visually-hidden"
                            accept={storyType === 'image' ? 'image/*' : 'video/*'}
                            onChange={handleFileChange}
                          />
                          <label htmlFor="file-upload" className="upload-label">
                            <div className="text-center">
                              <FaUpload size={24} className="mb-2" />
                              <p className="mb-0">
                                Click to {storyType === 'image' ? 'upload an image' : 'upload a video'}
                              </p>
                              <small className="text-muted">
                                {storyType === 'image' ? 'JPG, PNG or GIF' : 'MP4, MOV or WebM'}
                              </small>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </Form.Group>
                )}
                
                {/* Background color for text stories */}
                {storyType === 'text' && (
                  <Form.Group className="mb-4">
                    <Form.Label>Background Color</Form.Label>
                    <div className="color-picker-container">
                      {COLOR_OPTIONS.map((color, index) => (
                        <div 
                          key={index} 
                          className={`color-option ${backgroundColor === color ? 'selected' : ''}`} 
                          style={{ backgroundColor: color }}
                          onClick={() => setBackgroundColor(color)}
                        />
                      ))}
                    </div>
                  </Form.Group>
                )}
                
                {/* Caption for all story types */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    {storyType === 'text' ? 'Story Text' : 'Caption (optional)'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={storyType === 'text' ? 4 : 2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={storyType === 'text' ? 'Enter your story text...' : 'Add a caption to your story...'}
                    required={storyType === 'text'}
                    maxLength={storyType === 'text' ? 250 : 100}
                    className={storyType === 'text' ? 'text-story-input' : ''}
                    style={storyType === 'text' ? { backgroundColor } : {}}
                  />
                  <Form.Text className="text-muted">
                    {storyType === 'text' ? 
                      `${caption.length}/250 characters` : 
                      `${caption.length}/100 characters`
                    }
                  </Form.Text>
                </Form.Group>
                
                {/* Preview for text story */}
                {storyType === 'text' && caption && (
                  <div className="text-story-preview mb-4" style={{ backgroundColor }}>
                    <p className="preview-text">{caption}</p>
                  </div>
                )}
                
                {/* Submit button */}
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading || (storyType === 'text' ? !caption : !mediaContent)}
                  >
                    {loading ? 'Creating Story...' : 'Share Story'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateStory; 