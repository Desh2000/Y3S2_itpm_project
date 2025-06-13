import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleApprove = async (event) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/events/${event.id}/approve`);
      if (response.status === 200) {
        const updatedEvent = response.data;
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleUpdate = async (event) => {
    try {
      const updated = {
        ...event,
        startDateTime: new Date(event.startDateTime).toISOString(),
        endDateTime: new Date(event.endDateTime).toISOString()
      };
      const response = await axios.put(`http://localhost:8080/api/events/${event.id}`, updated );
      if (response.status === 200) {
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      startDateTime: event.startDateTime.slice(0, 16),
      endDateTime: event.endDateTime.slice(0, 16)
    });
  };

  const handleChange = (e) => {
    setEditingEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Event Report', 14, 15);
    const tableColumn = ["Name", "Category", "Location", "Start", "End", "Description", "Contact", "Email", "Status"];
    const tableRows = [];

    filteredEvents.forEach(event => {
      const eventData = [
        event.name,
        event.category,
        event.location,
        formatDateTime(event.startDateTime),
        formatDateTime(event.endDateTime),
        event.description,
        event.contactNumber,
        event.email,
        event.approved ? 'Approved' : 'Pending'
      ];
      tableRows.push(eventData);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 }
    });

    doc.save("event-report.pdf");
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Admin Panel</h2>
      <Form.Control
        className="mb-3 w-50 mx-auto"
        placeholder="Search by event name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="text-center mb-3">
        <Button variant="dark" onClick={exportToPDF}>Export as PDF</Button>
      </div>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Description</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(event => (
            editingEvent?.id === event.id ? (
              <tr key={event.id}>
                <td><Form.Control name="name" value={editingEvent.name} onChange={handleChange} /></td>
                <td><Form.Control name="category" value={editingEvent.category} onChange={handleChange} /></td>
                <td><Form.Control name="location" value={editingEvent.location} onChange={handleChange} /></td>
                <td><Form.Control type="datetime-local" name="startDateTime" value={editingEvent.startDateTime} onChange={handleChange} /></td>
                <td><Form.Control type="datetime-local" name="endDateTime" value={editingEvent.endDateTime} onChange={handleChange} /></td>
                <td><Form.Control name="description" value={editingEvent.description} onChange={handleChange} /></td>
                <td><Form.Control name="contactNumber" value={editingEvent.contactNumber} onChange={handleChange} /></td>
                <td><Form.Control name="email" value={editingEvent.email} onChange={handleChange} /></td>
                <td>{editingEvent.approved ? 'Approved' : 'Pending'}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleUpdate(editingEvent)}>Save</Button>{' '}
                  <Button variant="secondary" size="sm" onClick={() => setEditingEvent(null)}>Cancel</Button>
                </td>
              </tr>
            ) : (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.category}</td>
                <td>{event.location}</td>
                <td>{formatDateTime(event.startDateTime)}</td>
                <td>{formatDateTime(event.endDateTime)}</td>
                <td>{event.description}</td>
                <td>{event.contactNumber}</td>
                <td>{event.email}</td>
                <td className={event.approved ? 'text-success fw-bold' : 'text-warning fw-bold'}>
                  {event.approved ? 'Approved' : 'Pending'}
                </td>
                <td>
                  {!event.approved && <Button variant="success" size="sm" onClick={() => handleApprove(event)}>Approve</Button>}{' '}
                  <Button variant="primary" size="sm" onClick={() => handleEdit(event)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminPanel;