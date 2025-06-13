import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useChatbot } from '../contexts/ChatbotContext';
import './HelpTrigger.css';

/**
 * HelpTrigger - A component that can be placed next to any UI element to provide context-specific help
 * 
 * @param {Object} props - Component props
 * @param {string} props.topic - The help topic to query the chatbot with
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.placement - Where to place the help icon ('left', 'right', 'top', 'bottom')
 * @param {string} props.size - Size of the icon ('sm', 'md', 'lg')
 */
const HelpTrigger = ({ 
  topic, 
  className = '', 
  placement = 'right',
  size = 'md',
  ...props 
}) => {
  const { getHelp } = useChatbot();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    getHelp(topic);
  };

  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'fs-6';
      case 'lg': return 'fs-4';
      default: return 'fs-5';
    }
  };

  const getPlacementClass = () => {
    switch(placement) {
      case 'left': return 'me-2';
      case 'right': return 'ms-2';
      case 'top': return 'mb-2 d-block';
      case 'bottom': return 'mt-2 d-block';
      default: return 'ms-2';
    }
  };

  return (
    <span 
      className={`help-trigger ${getPlacementClass()} ${getSizeClass()} ${className}`}
      onClick={handleClick}
      role="button"
      title={`Get help with ${topic}`}
      {...props}
    >
      <FaQuestionCircle className="text-secondary help-icon" />
    </span>
  );
};

export default HelpTrigger; 