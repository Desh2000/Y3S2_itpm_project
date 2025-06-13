import React, { createContext, useState, useContext } from 'react';
import ChatbotService from '../services/ChatbotService';

// Create context
const ChatbotContext = createContext();

// Provider component
export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: ChatbotService.getRandomGreeting(), timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Open the chatbot
  const openChat = () => {
    setIsOpen(true);
  };
  
  // Close the chatbot
  const closeChat = () => {
    setIsOpen(false);
  };
  
  // Toggle chatbot visibility
  const toggleChat = () => {
    if (!isOpen && messages.length === 1) {
      // Reset greeting if only one message exists
      setMessages([
        { id: 1, sender: 'bot', text: ChatbotService.getRandomGreeting(), timestamp: new Date() }
      ]);
    }
    setIsOpen(!isOpen);
  };
  
  // Add a user message and get a response
  const sendMessage = async (text) => {
    if (!text || text.trim() === '') return;
    
    const userMessageId = messages.length + 1;
    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Get bot response
      const botResponse = await ChatbotService.generateResponse(text);
      
      // Simulate thinking delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: userMessageId + 1,
            sender: 'bot',
            text: botResponse,
            timestamp: new Date()
          }
        ]);
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Fallback response
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: userMessageId + 1,
            sender: 'bot',
            text: "I'm sorry, I'm having trouble processing your request. Please try again later.",
            timestamp: new Date()
          }
        ]);
      }, 1000);
    }
  };
  
  // Clear all messages and reset to initial state
  const resetChat = () => {
    setMessages([
      { id: 1, sender: 'bot', text: ChatbotService.getRandomGreeting(), timestamp: new Date() }
    ]);
  };
  
  // Get direct help on a specific topic
  const getHelp = async (topic) => {
    openChat();
    if (topic) {
      const helpText = `I need help with ${topic}`;
      await sendMessage(helpText);
    }
  };
  
  // Value to be provided
  const value = {
    isOpen,
    messages,
    isTyping,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    resetChat,
    getHelp
  };
  
  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotContext; 