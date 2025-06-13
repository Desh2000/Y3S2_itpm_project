import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaTimes, FaRobot, FaUser, FaComments, FaPaperPlane, FaInfoCircle, FaMicrophone, FaWindowClose } from 'react-icons/fa';
import ChatbotService from '../services/ChatbotService';
import VoiceCommandButton from './VoiceCommandButton';
import './Chatbot.css';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with greeting message when first opened
  useEffect(() => {
    if (messages.length === 0 && isChatOpen) {
      const greeting = ChatbotService.getRandomGreeting();
      setMessages([
        {
          id: Date.now(),
          text: greeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isChatOpen, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isChatOpen && inputRef.current && !isVoiceActive) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isChatOpen, isVoiceActive]);

  const toggleChat = () => {
    if (!isChatOpen && messages.length === 0) {
      // Reset state when opening for the first time
      const greeting = ChatbotService.getRandomGreeting();
      setMessages([
        {
          id: Date.now(),
          text: greeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Simulate typing
    setIsTyping(true);
    
    try {
      // Get bot response
      const botResponse = await ChatbotService.generateResponse(newUserMessage.text);
      
      // Add a slight delay to simulate thinking time
      setTimeout(() => {
        setIsTyping(false);
        
        const newBotMessage = {
          id: Date.now(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newBotMessage]);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Fallback message
      setTimeout(() => {
        setIsTyping(false);
        
        const fallbackMessage = {
          id: Date.now(),
          text: "I'm having trouble processing your request right now. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
      }, 1000);
    }
  };

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleVoiceTranscript = (transcript) => {
    setUserInput(transcript);
  };

  const handleVoiceStart = () => {
    setIsVoiceActive(true);
  };

  const handleVoiceStop = () => {
    setIsVoiceActive(false);
    
    // If we have text after voice input ends, submit it automatically
    if (userInput.trim()) {
      const newUserMessage = {
        id: Date.now(),
        text: userInput,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setUserInput('');
      
      // Get bot response
      setIsTyping(true);
      
      try {
        // Get bot response asynchronously
        ChatbotService.generateResponse(newUserMessage.text).then(botResponse => {
          // Add a slight delay to simulate thinking time
          setTimeout(() => {
            setIsTyping(false);
            
            const newBotMessage = {
              id: Date.now(),
              text: botResponse,
              sender: 'bot',
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, newBotMessage]);
          }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        });
      } catch (error) {
        console.error('Error getting chatbot response:', error);
        
        // Fallback message
        setTimeout(() => {
          setIsTyping(false);
          
          const fallbackMessage = {
            id: Date.now(),
            text: "I'm having trouble processing your request right now. Please try again later.",
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, fallbackMessage]);
        }, 1000);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Add a new greeting message
    const greeting = ChatbotService.getRandomGreeting();
    setTimeout(() => {
      setMessages([
        {
          id: Date.now(),
          text: greeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 300);
  };

  return (
    <div className="chatbot-container">
      {isChatOpen ? (
        <Card className="chatbot-card">
          <Card.Header className="chatbot-header">
            <div className="d-flex align-items-center">
              <FaRobot className="me-2" />
              <h5 className="mb-0">Chat Assistant</h5>
            </div>
            <div className="d-flex align-items-center">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Clear conversation</Tooltip>}
              >
                <Button 
                  variant="link" 
                  className="close-btn me-2" 
                  onClick={clearChat}
                  aria-label="Clear chat history"
                >
                  <FaInfoCircle />
                </Button>
              </OverlayTrigger>
              
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Close chat</Tooltip>}
              >
                <Button 
                  variant="link" 
                  className="close-btn" 
                  onClick={toggleChat}
                  onMouseEnter={() => setCloseHovered(true)}
                  onMouseLeave={() => setCloseHovered(false)}
                  aria-label="Close chat"
                >
                  {closeHovered ? <FaWindowClose /> : <FaTimes />}
                </Button>
              </OverlayTrigger>
            </div>
          </Card.Header>
          
          <Card.Body className="chatbot-body">
            <div className="messages-container">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
                >
                  <div className="message-icon">
                    {msg.sender === 'bot' ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot-message">
                  <div className="message-icon">
                    <FaRobot />
                  </div>
                  <div className="message-content typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </Card.Body>
          
          <Card.Footer className="chatbot-footer">
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder={isVoiceActive ? "Listening..." : "Type your message..."}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isVoiceActive}
                  className={isVoiceActive ? 'voice-active-textarea' : ''}
                  aria-label="Chat message"
                />
                <InputGroup.Text className="voice-command-wrapper">
                  <VoiceCommandButton
                    onTranscript={handleVoiceTranscript}
                    onStart={handleVoiceStart}
                    onStop={handleVoiceStop}
                    size="sm"
                    variant="primary"
                    showLanguageSelector={false}
                  />
                </InputGroup.Text>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Send message</Tooltip>}
                >
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!userInput.trim() || isVoiceActive}
                    aria-label="Send message"
                  >
                    <FaPaperPlane />
                  </Button>
                </OverlayTrigger>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      ) : (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Open chat assistant</Tooltip>}
        >
          <Button 
            className="chat-toggle-btn"
            variant="primary"
            onClick={toggleChat}
            aria-label="Open chat assistant"
          >
            <FaComments className="chat-icon" />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default Chatbot; 