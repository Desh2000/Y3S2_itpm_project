import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCircle.css';

const StoryCircle = ({ story, hasStory, onClick }) => {
  // If there's an actual story, use the author avatar, otherwise use the default user avatar
  const avatar = story?.authorAvatar || 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';
  
  return (
    <div 
      className={`story-circle ${hasStory ? 'has-story' : ''}`} 
      onClick={onClick}
    >
      <div className="avatar-wrapper">
        <img
          src={avatar}
          alt={story?.authorName || 'User'}
          className="story-avatar"
        />
      </div>
      {story && (
        <div className="story-author">{story.authorName}</div>
      )}
    </div>
  );
};

export default StoryCircle; 