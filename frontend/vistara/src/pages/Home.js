import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Post from '../components/Post';
import StoriesContainer from '../components/StoriesContainer';
import HelpTrigger from '../components/HelpTrigger';
import HomeBackground from '../components/HomeBackground';
import axios from 'axios';
import { FaPlus, FaArrowDown, FaBullhorn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Home.css';

const API_URL = 'http://localhost:8080/api';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/announcements`);
        setAnnouncements(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        // Load sample data as fallback during development
        loadSampleData();
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    
    // Show scroll indicator after a short delay
    const timer = setTimeout(() => {
      setScrollVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Hide scroll indicator on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSampleData = () => {
    // Sample data for development and testing
    const sampleData = [
      {
        id: 1,
        authorName: 'John Doe',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        content: 'Exciting news! We\'re launching a new product next week. Stay tuned for more details! This is going to be one of our biggest launches of the year. We\'ve been working on this for months and can\'t wait to share it with everyone.',
        startDate: new Date().toISOString(),
        mediaType: 'image',
        image: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        likes: 15,
        comments: [
          { id: 1, author: 'Jane Smith', text: 'Looking forward to it!', formattedTimestamp: '2 hours ago' },
          { id: 2, author: 'Mike Johnson', text: 'Can\'t wait to see what you\'ve been working on!', formattedTimestamp: '1 hour ago' }
        ]
      },
      {
        id: 2,
        authorName: 'Jane Smith',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        content: 'Our annual company meeting will be held next month. All employees are required to attend. We\'ll be discussing our goals for the upcoming year and reviewing our achievements from the past year.',
        startDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
        mediaType: 'text',
        backgroundColor: '#1877F2',
        likes: 8,
        comments: [
          { id: 1, author: 'Robert Johnson', text: 'Will it be in-person or virtual?', formattedTimestamp: '5 hours ago' },
          { id: 2, author: 'John Doe', text: 'Looking forward to it!', formattedTimestamp: '3 hours ago' }
        ]
      },
      {
        id: 3,
        authorName: 'Alex Wilson',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        content: 'Reminder: The deadline for submitting your quarterly reports is this Friday. Please make sure to complete them on time to avoid any delays in processing.',
        startDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        mediaType: 'text',
        backgroundColor: '#E1306C',
        likes: 12,
        comments: [
          { id: 1, author: 'Sarah Parker', text: 'Thanks for the reminder!', formattedTimestamp: '1 day ago' }
        ]
      }
    ];
    setAnnouncements(sampleData);
  };

  const handleLikeAnnouncement = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/announcements/${id}/like`);
      
      // Update the announcements state with the updated post
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement.id === id ? response.data : announcement
        )
      );
    } catch (err) {
      console.error('Error liking announcement:', err);
    }
  };

  const handleAddComment = async (announcementId, commentText) => {
    try {
      const comment = {
        author: 'Current User',
        text: commentText
      };
      
      const response = await axios.post(`${API_URL}/comments/announcement/${announcementId}`, comment);
      
      // Update the announcements state with the new comment
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => {
          if (announcement.id === announcementId) {
            return {
              ...announcement,
              comments: [...announcement.comments, response.data]
            };
          }
          return announcement;
        })
      );
      
      return response.data;
    } catch (err) {
      console.error('Error adding comment:', err);
      return null;
    }
  };

  const handleEditAnnouncement = async (id, newContent) => {
    try {
      // Call the actual API endpoint
      const response = await axios.put(`${API_URL}/announcements/${id}`, {
        content: newContent
      });
      
      // Update the state with the response data
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement.id === id ? response.data : announcement
        )
      );
      
      // Show success feedback
      alert('Announcement updated successfully');
    } catch (err) {
      console.error('Error updating announcement:', err);
      
      // For development/demo purposes, update the state directly if API fails
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement.id === id ? { ...announcement, content: newContent } : announcement
        )
      );
      
      alert('Announcement updated (API call failed, but state updated for demo)');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      // Call the API to delete the announcement
      await axios.delete(`${API_URL}/announcements/${id}`);
      
      // Update the local state
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.filter(announcement => announcement.id !== id)
      );
      
      // Show success feedback
      alert('Announcement deleted successfully');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      
      // For development/demo purposes, update the state directly if API fails
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.filter(announcement => announcement.id !== id)
      );
      
      alert('Announcement deleted (API call failed, but state updated for demo)');
    }
  };

  return (
    <>
      <HomeBackground />
      <div className="home-content">
        <StoriesContainer />
        
        <Container className="py-3 py-md-4">
          <div className="home-welcome-section">
            <div className="welcome-message">
              <h1 className="welcome-title">Welcome to the <span className="highlight">Visthara</span></h1>
              <p className="welcome-subtitle">Stay connected with the latest announcements and stories</p>
            </div>
            
            <div className={`scroll-indicator ${scrollVisible ? 'visible' : ''}`}>
              <span>Scroll to explore</span>
              <FaArrowDown className="bounce" />
            </div>
          </div>
          
          <Row className="mb-3 mb-md-4 align-items-center announcement-section">
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start section-title">
                <FaBullhorn className="section-icon" />
                <h2 className="text-primary fs-3 fw-bold m-0">Recent Announcements</h2>
                <HelpTrigger topic="announcements" placement="right" />
              </div>
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end">
              <Link to="/create-announcement" className="w-100 w-md-auto">
                <Button className="create-btn w-100 w-md-auto">
                  <FaPlus className="me-2" /> Create New Announcement
                </Button>
              </Link>
            </Col>
          </Row>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="announcement-list">
            {loading ? (
              <div className="text-center p-4 loading-container">
                <div className="spinner-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="loading-rings">
                    <div className="loading-ring"></div>
                    <div className="loading-ring"></div>
                    <div className="loading-ring"></div>
                  </div>
                </div>
                <p className="mt-3">Loading announcements...</p>
              </div>
            ) : announcements.length > 0 ? (
              <div className="announcement-items">
                {announcements.map(announcement => (
                  <Post 
                    key={announcement.id} 
                    post={announcement} 
                    onLike={() => handleLikeAnnouncement(announcement.id)}
                    onAddComment={(text) => handleAddComment(announcement.id, text)}
                    onEdit={handleEditAnnouncement}
                    onDelete={handleDeleteAnnouncement}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center p-3 p-md-5 empty-state">
                <Card.Body>
                  <Card.Title className="mb-3">No announcements yet</Card.Title>
                  <Card.Text className="mb-4">Be the first to create an announcement!</Card.Text>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link to="/create-announcement">
                      <Button className="create-btn">Create Announcement</Button>
                    </Link>
                    <HelpTrigger topic="creating your first announcement" placement="right" className="new-feature" />
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Home; 