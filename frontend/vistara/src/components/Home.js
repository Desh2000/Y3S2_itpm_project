import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

// Modern CSS styles
const styles = `
  /* Reset default calendar styles */
  .react-calendar {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px; /* Reduced padding to make it slightly smaller */
    background: white;
    width: 90%; /* Slightly reduce the width to make it smaller */
  }

  .react-calendar__tile {
    padding: 10px; /* Reduced padding for tiles */
    transition: all 0.2s ease;
  }

  .react-calendar__tile--now {
    background: transparent !important;
    color: #4f46e5 !important;
    font-weight: 600;
  }

  .react-calendar__tile--active {
    background: #4f46e5 !important;
    color: white !important;
    border-radius: 8px;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: #e0e7ff;
    color: #4f46e5;
    border-radius: 8px;
  }

  .event-dot {
    height: 8px;
    width: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    margin: 4px auto 0;
  }

  /* Custom container styles */
  .event-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .event-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 20px;
    transition: transform 0.2s ease;
  }

  .event-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .event-title {
    color: #1f2937;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .event-subtitle {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .event-button {
    background: #4f46e5;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .event-button:hover {
    background: #4338ca;
    color: white;
  }

  .event-list-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    border-left: 4px solid #4f46e5;
  }

  .event-detail {
    color: #4b5563;
    font-size: 0.95rem;
  }

  /* Center the Upcoming Events section */
  .upcoming-events {
    display: flex;
    justify-content: center;
  }

  /* Align the calendar and events for selected date to the right */
  .calendar-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 40%; /* Ensure it takes full width to align properly */
  }

  /* Resize the Events for Selected Date section */
  .events-for-selected-date {
    width: 90%; /* Match the calendar's reduced width */
  }

`;

function Home() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events/approved', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('Fetched approved events:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    const listener = () => fetchEvents();
    window.addEventListener("eventUpdated", listener);
  
    return () => {
      window.removeEventListener("eventUpdated", listener);
    };
  }, []);

  const handleDateClick = (date) => {
    setDate(date);
    const dayEvents = events.filter(event => {
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return current >= start && current <= end;
    });
    setSelectedEvents(dayEvents);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours() + 5;
    let minutes = date.getUTCMinutes() + 30;
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    if (hours >= 24) {
      hours -= 24;
    }
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="event-container">
      <style>{styles}</style>
      <div className="event-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="event-title">Event </h1>
        <button 
          onClick={() => navigate('/create')} 
          className="event-button"
        >
         + Add New Event
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 upcoming-events">
          <div className="event-card">
            <h2 className="event-subtitle">Upcoming Events</h2>
            {events.length === 0 ? (
              <p className="event-detail">No approved events yet.</p>
            ) : (
              <div>
                {events.map(event => (
                  <div key={event.id} className="event-list-item">
                    <strong> {event.name}</strong><br/> 
                    Category: {event.category}
                    <br />
                    <span className="event-detail">
                      Location: {event.location} 
                      <br />
                      Start Date and Time: ({formatDateTime(event.startDateTime)})
                      <br/> 
                      End date and Time: ({formatDateTime(event.endDateTime)})
                    </span>
                    <br />
                    <span className="event-detail">
                       {event.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <div className="calendar-section">
            <div className="event-card">
              <h2 className="event-subtitle">Event Calendar</h2>
              <Calendar
                onChange={handleDateClick}
                value={date}
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dayEvents = events.filter(event => {
                      const startDate = new Date(event.startDateTime);
                      const endDate = new Date(event.endDateTime);
                      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                      const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      return current >= start && current <= end;
                    });
                    return dayEvents.length > 0 ? (
                      <div className="event-dot"></div>
                    ) : null;
                  }
                }}
              />
              <h3 className="event-subtitle mt-4">Events for Selected Date</h3>
              <div className="events-for-selected-date">
                {selectedEvents.length > 0 ? (
                  <div>
                    {selectedEvents.map(event => (
                      <div key={event.id} className="event-list-item">
                        <strong>Event Name: {event.name}</strong>
                        <br />
                        <span className="event-detail">
                          Location: {event.location}
                          <br />
                          Start Date and Time: {formatDateTime(event.startDateTime)} 
                          <br/>
                          End Date and Time: {formatDateTime(event.endDateTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="event-detail">No events on this date.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;   