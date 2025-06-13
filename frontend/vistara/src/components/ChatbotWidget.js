import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        handleTranscript(transcript);
      };

      recog.onstart = () => setIsRecording(true);
      recog.onend = () => setIsRecording(false);
      recog.onerror = (e) => {
        console.error('SpeechRecognition error', e);
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const pushMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const toggleOpen = () => {
    setOpen(o => !o);
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Common handler for both typed and recorded text
  const handleTranscript = async (text) => {
    pushMessage('user', text);
    try {
      const { data } = await axios.post('http://localhost:8000/converse', {
        session_id: sessionId,
        text
      });
      setSessionId(data.session_id);

      if (data.prompt) {
        pushMessage('bot', data.prompt);
      } else if (data.complete) {
        pushMessage('bot', 'Got it! Summarizing details…');
        const resp = await axios.post('http://localhost:8000/summarize', {
          slots: data.complete.slots
        });
        navigate('/create-announcement', {
          state: { slots: data.complete.slots, summary: resp.data.summary }
        });
      }
    } catch (err) {
      console.error(err);
      pushMessage('bot', '⚠️ Sorry, something went wrong.');
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    handleTranscript(text);
  };

  return (
    <>
      {!open && (
        <div
          onClick={toggleOpen}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          💬
        </div>
      )}

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 320,
            height: 460,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span onClick={toggleOpen} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Chatbot
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isRecording && (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'red',
                    animation: 'pulse 1s infinite'
                  }}
                  title="Recording..."
                />
              )}
              <FaTrash onClick={clearChat} style={{ cursor: 'pointer' }} title="Clear Chat" />
            </div>
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', fontSize: 14 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{ marginBottom: 8, textAlign: m.from === 'user' ? 'right' : 'left' }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: m.from === 'user' ? '#dcf8c6' : '#f1f0f0',
                    padding: '6px 10px',
                    borderRadius: 4,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '6px', alignItems: 'center' }}>
            {isRecording ? (
              <button
                onClick={stopRecording}
                style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}
                title="Stop Recording"
              >
                ⏹️
              </button>
            ) : (
              <button
                onClick={startRecording}
                style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}
                title="Record"
              >
                🎤
              </button>
            )}
            <input
              style={{ flex: 1, padding: '6px', borderRadius: 4, border: '1px solid #ccc' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={isRecording}
            />
            <button
              onClick={sendMessage}
              style={{ border: 'none', backgroundColor: '#007bff', color: 'white', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
