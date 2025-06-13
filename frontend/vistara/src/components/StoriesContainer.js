import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoryCircle from './StoryCircle';
import StoryViewer from './StoryViewer';
import HelpTrigger from './HelpTrigger';
import { FaPlus } from 'react-icons/fa';
import './StoriesContainer.css';

const API_URL = 'http://localhost:8080/api';

const StoriesContainer = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedUserStories, setSelectedUserStories] = useState([]);
  
  // Group stories by author
  const storyGroups = React.useMemo(() => {
    const groups = {};
    
    stories.forEach(story => {
      const authorName = story.authorName;
      if (!groups[authorName]) {
        groups[authorName] = [];
      }
      groups[authorName].push(story);
    });
    
    return Object.keys(groups).map(authorName => ({
      authorName,
      authorAvatar: groups[authorName][0]?.authorAvatar,
      stories: groups[authorName]
    }));
  }, [stories]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/stories`);
        setStories(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories. Please try again later.');
        
        // Load sample data for development
        loadSampleData();
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const loadSampleData = () => {
    // Sample data for testing when API is not available
    const sampleData = [
      {
        id: 1,
        mediaContent: 'https://source.unsplash.com/random/800x1200?portrait',
        caption: 'Having a great day at the beach!',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        authorName: 'John Doe',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        active: true,
        mediaType: 'image',
        views: 12
      },
      {
        id: 2,
        mediaContent: 'https://source.unsplash.com/random/800x1200?landscape',
        caption: 'Beautiful sunset today',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        authorName: 'Jane Smith',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        active: true,
        mediaType: 'image',
        views: 8
      },
      {
        id: 3,
        mediaContent: null,
        caption: 'Just got a promotion! So excited!',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        authorName: 'John Doe',
        authorAvatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
        active: true,
        backgroundColor: '#1877F2',
        mediaType: 'text',
        views: 15
      }
    ];
    
    setStories(sampleData);
  };

  const handleStoryCircleClick = (authorName, index = 0) => {
    const userStories = storyGroups.find(group => group.authorName === authorName)?.stories || [];
    setSelectedUserStories(userStories);
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
  };

  return (
    <div className="stories-container">
      <Container fluid="lg" className="px-0">
        <Card className="stories-card w-100">
          <Card.Body className="p-2 p-md-4">
            <div className="stories-header d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <h6 className="m-0 stories-title">Stories</h6>
                <HelpTrigger topic="stories" placement="right" size="sm" />
              </div>
              <div className="d-flex align-items-center">
                <Link to="/create-story" className="btn btn-sm btn-link text-primary">
                  <FaPlus className="me-1" /> Add Story
                </Link>
                <HelpTrigger topic="creating stories" placement="left" size="sm" />
              </div>
            </div>
            
            <div className="stories-scroll-container w-100">
              {loading ? (
                <div className="stories-loading">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="ms-2">Loading stories...</span>
                </div>
              ) : error ? (
                <div className="stories-error text-danger">
                  {error}
                </div>
              ) : storyGroups.length > 0 ? (
                <div className="stories-scroll-area w-100">
                  {/* Add your own story circle first */}
                  <StoryCircle 
                    hasStory={false}
                    onClick={() => {}}
                  />
                  
                  {storyGroups.map((group, index) => (
                    <StoryCircle 
                      key={index}
                      story={group.stories[0]}
                      hasStory={true}
                      onClick={() => handleStoryCircleClick(group.authorName)}
                    />
                  ))}
                </div>
              ) : (
                <div className="stories-empty text-center py-3 w-100">
                  <p className="mb-2 text-muted">No stories yet</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link to="/create-story" className="btn btn-sm btn-primary">
                      <FaPlus className="me-1" /> Create First Story
                    </Link>
                    <HelpTrigger topic="creating your first story" placement="right" className="new-feature" size="sm" />
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
      
      {showStoryViewer && (
        <StoryViewer 
          stories={selectedUserStories}
          currentIndex={currentStoryIndex}
          show={showStoryViewer}
          onHide={handleCloseStoryViewer}
        />
      )}
    </div>
  );
};

export default StoriesContainer; 