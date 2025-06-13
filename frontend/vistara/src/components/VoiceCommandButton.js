import React, { useState, useEffect, useRef } from 'react';
import { Button, Spinner, OverlayTrigger, Tooltip, Dropdown, Overlay, Popover } from 'react-bootstrap';
import { FaMicrophone, FaMicrophoneSlash, FaGlobe, FaVolumeUp, FaRobot } from 'react-icons/fa';
import speechService, { SPEECH_LANGUAGES } from '../services/SpeechService';
import './VoiceCommandButton.css';

/**
 * VoiceCommandButton - A button component for voice input
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onTranscript - Callback for when transcript is received
 * @param {Function} props.onStart - Callback for when recording starts
 * @param {Function} props.onStop - Callback for when recording stops
 * @param {String} props.variant - Bootstrap button variant
 * @param {String} props.size - Button size
 * @param {String} props.className - Additional CSS classes
 * @param {Boolean} props.showLanguageSelector - Whether to show language selection dropdown
 * @param {Boolean} props.showAssistantPopup - Whether to show the assistant popup
 */
const VoiceCommandButton = ({ 
  onTranscript, 
  onStart, 
  onStop,
  variant = 'primary',
  size = 'md',
  className = '',
  showLanguageSelector = true,
  showAssistantPopup = true,
  ...props
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState(speechService.getCurrentLanguage());
  const [showPopup, setShowPopup] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  
  const buttonRef = useRef(null);
  const popupTimeoutRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    setIsSupported(speechService.checkSupport());
  }, []);

  // Clear any timeout when component unmounts
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsLoading(true);
    setError(null);
    setTranscript('');
    
    if (showAssistantPopup) {
      setAssistantMessage('Listening to you...');
      setShowPopup(true);
    }

    const started = speechService.start(
      // onResult
      (text, confidence) => {
        setTranscript(text);
        setConfidenceLevel(confidence);
        
        if (onTranscript) onTranscript(text);
        
        if (showAssistantPopup) {
          if (confidence < 0.5) {
            setAssistantMessage('Hmm, speak a bit more clearly please...');
          } else if (confidence < 0.8) {
            setAssistantMessage('I think you said: ' + text);
          } else {
            setAssistantMessage('I heard: ' + text);
          }
        }
      },
      // onEnd
      () => {
        setIsListening(false);
        setIsLoading(false);
        
        if (showAssistantPopup) {
          setAssistantMessage('Processing complete!');
          
          // Hide popup after 3 seconds
          popupTimeoutRef.current = setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        }
        
        if (onStop) onStop();
      },
      // onError
      (error) => {
        setError(error);
        setIsListening(false);
        setIsLoading(false);
        
        if (showAssistantPopup) {
          setAssistantMessage(`Error: ${error}`);
          
          // Hide popup after 5 seconds
          popupTimeoutRef.current = setTimeout(() => {
            setShowPopup(false);
          }, 5000);
        }
        
        if (onStop) onStop();
      },
      // language
      language
    );

    if (started) {
      setIsListening(true);
      if (onStart) onStart();
    }
    
    setIsLoading(false);
  };

  const stopListening = () => {
    speechService.stop();
    setIsListening(false);
    
    if (showAssistantPopup) {
      setAssistantMessage('Processing speech...');
    }
    
    if (onStop) onStop();
  };

  const handleLanguageChange = (langCode) => {
    speechService.setLanguage(langCode);
    setLanguage(langCode);
    
    // If currently listening, restart recognition with new language
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 300);
    }
  };

  const getCurrentLanguageName = () => {
    const lang = SPEECH_LANGUAGES.find(l => l.code === language);
    return lang ? lang.name : 'English (US)';
  };

  const getAssistantIcon = () => {
    if (isLoading) return <Spinner animation="border" size="sm" />;
    if (isListening) return <FaVolumeUp className="animated-icon" />;
    return <FaRobot />;
  };

  // Render a disabled button if speech recognition is not supported
  if (!isSupported) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Voice commands are not supported in your browser</Tooltip>}
      >
        <span className="d-inline-block">
          <Button
            variant={variant}
            disabled
            className={`voice-command-btn mic-circle ${className}`}
            style={{ opacity: 0.65 }}
          >
            <FaMicrophoneSlash />
          </Button>
        </span>
      </OverlayTrigger>
    );
  }

  // Basic button without language selector
  if (!showLanguageSelector) {
    return (
      <>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              {isListening 
                ? 'Click to stop recording' 
                : error 
                  ? `Error: ${error}` 
                : 'Click to start voice input'
              }
            </Tooltip>
          }
        >
          <Button
            ref={buttonRef}
            variant={isListening ? 'danger' : variant}
            className={`voice-command-btn mic-circle ${className} ${isListening ? 'pulse-animation' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
            size={size}
            {...props}
          >
            <div className="mic-icon-wrapper">
              {isLoading ? (
                <Spinner 
                  as="span" 
                  animation="border" 
                  size="sm" 
                  role="status" 
                  aria-hidden="true" 
                />
              ) : isListening ? (
                <FaMicrophone className="sound-wave" />
              ) : (
                <FaMicrophoneSlash />
              )}
            </div>
          </Button>
        </OverlayTrigger>
        
        {showAssistantPopup && showPopup && (
          <Overlay
            show={showPopup}
            target={buttonRef.current}
            placement="bottom"
            container={buttonRef.current}
            containerPadding={20}
          >
            <Popover id="assistant-popover" className="assistant-popover">
              <Popover.Header as="h3" className="d-flex align-items-center">
                {getAssistantIcon()}
                <span className="ms-2">Voice Assistant</span>
              </Popover.Header>
              <Popover.Body>
                <p className="mb-0">{assistantMessage}</p>
                {isListening && (
                  <div className="sound-wave-container mt-2">
                    <div className="sound-wave-bar"></div>
                    <div className="sound-wave-bar"></div>
                    <div className="sound-wave-bar"></div>
                    <div className="sound-wave-bar"></div>
                    <div className="sound-wave-bar"></div>
                  </div>
                )}
              </Popover.Body>
            </Popover>
          </Overlay>
        )}
      </>
    );
  }

  // Button with language selector
  return (
    <div className="voice-command-container">
      <Dropdown>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              {isListening 
                ? 'Click to stop recording' 
                : error 
                  ? `Error: ${error}` 
                : `Click to start voice input in ${getCurrentLanguageName()}`
              }
            </Tooltip>
          }
        >
          <Button
            ref={buttonRef}
            variant={isListening ? 'danger' : variant}
            className={`voice-command-btn mic-circle ${className} ${isListening ? 'pulse-animation' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
            size={size}
            {...props}
          >
            <div className="mic-icon-wrapper">
              {isLoading ? (
                <Spinner 
                  as="span" 
                  animation="border" 
                  size="sm" 
                  role="status" 
                  aria-hidden="true" 
                />
              ) : isListening ? (
                <FaMicrophone className="sound-wave" />
              ) : (
                <FaMicrophoneSlash />
              )}
            </div>
          </Button>
        </OverlayTrigger>
        
        <Dropdown.Toggle
          split
          variant={isListening ? 'danger' : variant}
          className="voice-language-toggle"
          disabled={isListening || isLoading}
        >
          <FaGlobe size="0.8em" />
        </Dropdown.Toggle>
        
        <Dropdown.Menu className="voice-language-menu">
          <Dropdown.Header>Select Language</Dropdown.Header>
          {SPEECH_LANGUAGES.map(lang => (
            <Dropdown.Item 
              key={lang.code}
              active={language === lang.code}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      
      {showAssistantPopup && showPopup && (
        <Overlay
          show={showPopup}
          target={buttonRef.current}
          placement="bottom"
          container={buttonRef.current}
          containerPadding={20}
        >
          <Popover id="assistant-popover" className="assistant-popover">
            <Popover.Header as="h3" className="d-flex align-items-center">
              {getAssistantIcon()}
              <span className="ms-2">Voice Assistant</span>
            </Popover.Header>
            <Popover.Body>
              <p className="mb-0">{assistantMessage}</p>
              {isListening && (
                <div className="sound-wave-container mt-2">
                  <div className="sound-wave-bar"></div>
                  <div className="sound-wave-bar"></div>
                  <div className="sound-wave-bar"></div>
                  <div className="sound-wave-bar"></div>
                  <div className="sound-wave-bar"></div>
                </div>
              )}
            </Popover.Body>
          </Popover>
        </Overlay>
      )}
    </div>
  );
};

export default VoiceCommandButton; 