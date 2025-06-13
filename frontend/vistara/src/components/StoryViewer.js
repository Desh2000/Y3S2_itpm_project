import React, { useState, useEffect, useRef } from 'react';
import { Modal, ProgressBar, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import axios from 'axios';
import './StoryViewer.css';

const API_URL = 'http://localhost:8080/api';

const StoryViewer = ({ stories, currentIndex, show, onHide, onNext, onPrevious }) => {
  const [progress, setProgress] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex || 0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef(null);
  const viewTracked = useRef(false);
  
  const currentStory = stories[currentStoryIndex];
  
  // Function to track story view
  const trackStoryView = async (storyId) => {
    try {
      await axios.post(`${API_URL}/stories/${storyId}/view`);
      viewTracked.current = true;
    } catch (error) {
      console.error('Error tracking story view:', error);
    }
  };
  
  // Reset progress when changing stories
  useEffect(() => {
    if (show) {
      setProgress(0);
      viewTracked.current = false;
      setCurrentStoryIndex(currentIndex || 0);
    }
  }, [show, currentIndex]);
  
  // Handle auto progress
  useEffect(() => {
    if (show && !isPaused) {
      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Track the view once
      if (!viewTracked.current && currentStory) {
        trackStoryView(currentStory.id);
      }
      
      // Set up progress interval - complete in 5 seconds
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          
          // Move to next story when progress is complete
          if (newProgress >= 100) {
            clearInterval(progressInterval.current);
            
            if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex(prevIndex => prevIndex + 1);
            } else {
              // Last story completed
              onHide();
            }
            
            return 0;
          }
          
          return newProgress;
        });
      }, 50); // Update every 50ms for smooth progress
      
      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    }
  }, [show, isPaused, currentStoryIndex, stories.length, onHide, currentStory]);
  
  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prevIndex => prevIndex + 1);
      setProgress(0);
      viewTracked.current = false;
    } else {
      onHide();
    }
  };
  
  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prevIndex => prevIndex - 1);
      setProgress(0);
      viewTracked.current = false;
    }
  };
  
  const handleClose = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    onHide();
  };
  
  // Pause on mouse down, resume on mouse up
  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);
  
  if (!currentStory) return null;
  
  const getStoryContent = () => {
    switch (currentStory.mediaType) {
      case 'image':
        return (
          <img 
            src={currentStory.mediaContent.startsWith('data:') ? 
              currentStory.mediaContent : 
              `data:image/jpeg;base64,${currentStory.mediaContent}`
            } 
            alt="Story" 
            className="story-image" 
          />
        );
      case 'video':
        return (
          <video 
            src={currentStory.mediaContent.startsWith('data:') ? 
              currentStory.mediaContent : 
              `data:video/mp4;base64,${currentStory.mediaContent}`
            }
            autoPlay
            loop
            muted
            className="story-video"
          />
        );
      case 'text':
        return (
          <div 
            className="story-text" 
            style={{ backgroundColor: currentStory.backgroundColor || '#000000' }}
          >
            <p>{currentStory.caption}</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      fullscreen="md-down" 
      contentClassName="story-viewer-modal-content"
      dialogClassName="story-viewer-modal-dialog"
    >
      <div className="story-viewer-container">
        {/* Progress bar for each story */}
        <div className="story-progress-container">
          {stories.map((_, index) => (
            <div key={index} className="story-progress-item" style={{ width: `${100 / stories.length}%` }}>
              <ProgressBar 
                now={index === currentStoryIndex ? progress : (index < currentStoryIndex ? 100 : 0)}
                className="story-progress-bar"
              />
            </div>
          ))}
        </div>
        
        {/* Story header */}
        <div className="story-header">
          <div className="story-user-info">
            <img 
              src={currentStory.authorAvatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"} 
              alt={currentStory.authorName} 
              className="story-user-avatar"
            />
            <div className="story-user-details">
              <div className="story-username">{currentStory.authorName}</div>
              <div className="story-timestamp">
                {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <Button variant="link" className="story-close-btn" onClick={handleClose}>
            <FaTimes />
          </Button>
        </div>
        
        {/* Story content */}
        <div 
          className="story-content"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {getStoryContent()}
          
          {/* Caption if exists */}
          {currentStory.caption && currentStory.mediaType !== 'text' && (
            <div className="story-caption">
              {currentStory.caption}
            </div>
          )}
          
          {/* Navigation arrows */}
          {currentStoryIndex > 0 && (
            <Button 
              variant="link" 
              className="story-nav-btn story-prev-btn"
              onClick={handlePrevious}
            >
              <FaChevronLeft />
            </Button>
          )}
          
          {currentStoryIndex < stories.length - 1 && (
            <Button 
              variant="link" 
              className="story-nav-btn story-next-btn"
              onClick={handleNext}
            >
              <FaChevronRight />
            </Button>
          )}
        </div>
        
        {/* Story footer */}
        <div className="story-footer">
          <div className="story-action-buttons">
            <Button variant="link" className="story-action-btn">
              <FaHeart /> <span className="story-action-text">Like</span>
            </Button>
            <Button variant="link" className="story-action-btn">
              <FaComment /> <span className="story-action-text">Comment</span>
            </Button>
            <Button variant="link" className="story-action-btn">
              <FaShare /> <span className="story-action-text">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StoryViewer; 