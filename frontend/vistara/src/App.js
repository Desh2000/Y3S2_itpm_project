import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreateEvent from './pages/CreateEvent';
import ViewEvent from './pages/ViewEvent';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateAnnouncement from './pages/CreateAnnouncement';
import CreateStory from './pages/CreateStory';
import Chatbot from './components/Chatbot';
import ChatbotWidget from './components/ChatbotWidget';
import { ChatbotProvider } from './contexts/ChatbotContext';
import EventAdminpannel from './pages/EventAdminPannel';
import UserAdmin from './pages/UserAdmin';

function App() {
  return (
    <ChatbotProvider>
      <Router>
        <div className="app-container d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-announcement" element={<CreateAnnouncement />} />
              <Route path="/create-story" element={<CreateStory />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/view-event" element={<ViewEvent />} />
              <Route path="/event-admin-panel" element={<EventAdminpannel />} />
              {/* <Route path="/user-admin-panel" element={<UserAdmin />} /> */}
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
          {/* <Chatbot /> */}
          <ChatbotWidget/>
        </div>
      </Router>
    </ChatbotProvider>
  );
}

export default App;
