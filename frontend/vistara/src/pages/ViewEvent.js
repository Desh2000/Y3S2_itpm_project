import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

function Home() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    const selected = events.filter(event => {
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      const d = new Date(selectedDate);
      return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
    setSelectedEvents(selected);
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

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Events</h2>
          <Button variant="primary" onClick={() => navigate('/create-event')}>+ Add New Event</Button>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3 text-muted">Upcoming Events</h4>
              <Form.Control
                type="text"
                placeholder="Search by name, category, or location"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredEvents.length === 0 ? (
                <p className="text-muted">No matching events found.</p>
              ) : (
                filteredEvents.map(event => (
                  <Card key={event.id} className="mb-3 border-start border-primary border-4">
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{event.category}</Card.Subtitle>
                      <Card.Text>
                        <strong>Location:</strong> {event.location}<br />
                        <strong>Start:</strong> {formatDateTime(event.startDateTime)}<br />
                        <strong>End:</strong> {formatDateTime(event.endDateTime)}<br />
                        {event.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3 text-muted">Event Calendar</h4>
              <Calendar
                onChange={handleDateClick}
                value={date}
                tileContent={({ date: tileDate, view }) => {
                  if (view === 'month') {
                    const hasEvent = events.some(event => {
                      const startDate = new Date(event.startDateTime);
                      const endDate = new Date(event.endDateTime);
                      const current = new Date(tileDate.getFullYear(), tileDate.getMonth(), tileDate.getDate());
                      return current >= new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) &&
                             current <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                    });
                    return hasEvent ? <div style={{ height: 8, width: 8, borderRadius: '50%', backgroundColor: '#dc3545', margin: '2px auto 0' }}></div> : null;
                  }
                }}
              />
              <h5 className="mt-4">Events on {date.toDateString()}</h5>
              {selectedEvents.length > 0 ? (
                selectedEvents.map(event => (
                  <Card key={event.id} className="mb-3 border-start border-success border-4">
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Text>
                        <strong>Location:</strong> {event.location}<br />
                        <strong>Start:</strong> {formatDateTime(event.startDateTime)}<br />
                        <strong>End:</strong> {formatDateTime(event.endDateTime)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted">No events on this date.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;