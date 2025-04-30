import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

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

  // Compute the current date-time in the format required by datetime-local (e.g., "2025-03-21T00:00")
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleApprove = async (event) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/events/${event.id}/approve`);
      if (response.status === 200) {
        const updatedEvent = response.data;
        setEvents(prevEvents => prevEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleUpdate = async (event) => {
    try {
      const updatedEvent = { ...event, startDateTime: new Date(event.startDateTime).toISOString(), endDateTime: new Date(event.endDateTime).toISOString() };
      const response = await axios.put(`http://localhost:8080/api/events/${event.id}`, updatedEvent);
      if (response.status === 200) {
        setEvents(prevEvents => prevEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      startDateTime: new Date(event.startDateTime).toISOString().split('T')[0] + 'T' + new Date(event.startDateTime).toTimeString().split(' ')[0].substr(0,5),
      endDateTime: new Date(event.endDateTime).toISOString().split('T')[0] + 'T' + new Date(event.endDateTime).toTimeString().split(' ')[0].substr(0,5)
    });
  };

  const handleChange = (e) => {
    setEditingEvent(prevEvent => ({ ...prevEvent, [e.target.name]: e.target.value }));
  };

  // Helper function to format date-time in "MM/DD/YYYY hh:mm AM/PM" format in local time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime); // Parse the OffsetDateTime string (e.g., "2025-03-21T17:19:00+05:30")
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Use UTC methods to avoid local time zone adjustment
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours() + 5; // Add Colombo offset (UTC+5:30)
    let minutes = date.getUTCMinutes() + 30;
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    if (hours >= 24) {
      hours -= 24;
      // Note: This simple adjustment doesn't handle date rollover; for production, use a library like moment.js
    }
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="container">
      <style>
        {`
          /* General container styling */
          .container {
            padding: 20px;
            max-width: 100%;
            margin: 0 auto;
          }

          /* Heading styling */
          h1 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }

          /* Table styling */
          .table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }

          /* Table header styling */
          .table thead {
            background-color: #f8f9fa;
            color: #333;
            font-weight: bold;
          }

          .table th {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            font-size: 0.9rem;
            text-transform: uppercase;
          }

          /* Table body styling */
          .table tbody tr {
            border-bottom: 1px solid #dee2e6;
          }

          .table tbody tr:hover {
            background-color: #f1f3f5;
          }

          /* Table cell styling */
          .table td {
            padding: 10px 15px;
            font-size: 0.9rem;
            color: #555;
            vertical-align: middle;
          }

          /* Input fields in edit mode */
          .table input,
          .table textarea {
            width: 100%;
            padding: 5px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 0.9rem;
            box-sizing: border-box;
          }

          .table input:focus,
          .table textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          }

          /* Button styling */
          .btn {
            padding: 6px 12px;
            font-size: 0.9rem;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          /* Approve button (Success) */
          .btn-success {
            background-color: #28a745;
            border-color: #28a745;
            color: #fff;
          }

          .btn-success:hover {
            background-color: #218838;
            border-color: #1e7e34;
          }

          /* Edit button (Primary) */
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            color: #fff;
          }

          .btn-primary:hover {
            background-color: #0056b3;
            border-color: #004085;
          }

          /* Delete button (Danger) */
          .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
            color: #fff;
          }

          .btn-danger:hover {
            background-color: #c82333;
            border-color: #bd2130;
          }

          /* Save button (Success) */
          .btn-success.mr-2 {
            margin-right: 8px;
          }

          /* Cancel button (Secondary) */
          .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
            color: #fff;
          }

          .btn-secondary:hover {
            background-color: #5a6268;
            border-color: #545b62;
          }

          /* Status column styling */
          .status-pending,
          .status-approved {
            font-weight: 500;
            display: flex;
            align-items: center;
          }

          .status-pending::before,
          .status-approved::before {
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
          }

          .status-pending::before {
            background-color: #dc3545; /* Red for Pending */
          }

          .status-approved::before {
            background-color: #28a745; /* Green for Approved */
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .table {
              font-size: 0.8rem;
            }

            .table th,
            .table td {
              padding: 8px 10px;
            }

            .btn {
              padding: 4px 8px;
              font-size: 0.8rem;
            }

            .table thead {
              display: none;
            }

            .table tbody tr {
              display: block;
              margin-bottom: 15px;
              border: 1px solid #dee2e6;
              border-radius: 4px;
              padding: 10px;
            }

            .table tbody td {
              display: block;
              text-align: left;
              padding: 5px 10px;
              border: none;
            }

            .table tbody td:before {
              content: attr(data-label);
              font-weight: bold;
              display: inline-block;
              width: 40%;
              color: #333;
            }

            .table tbody td:last-child {
              text-align: center;
            }

            .btn {
              display: inline-block;
              margin: 5px 5px 0 0;
            }
          }
        `}
      </style>

      <h1>Admin Panel</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Start Date and Time</th>
            <th>End Date and Time</th>
            <th>Description</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            editingEvent && editingEvent.id === event.id ? (
              <tr key={event.id}>
                <td data-label="Name">
                  <input name="name" value={editingEvent.name} onChange={handleChange} />
                </td>
                <td data-label="Category">
                  <input name="category" value={editingEvent.category} onChange={handleChange} />
                </td>
                <td data-label="Location">
                  <input name="location" value={editingEvent.location} onChange={handleChange} />
                </td>
                <td data-label="Start">
                  <input
                    type="datetime-local"
                    name="startDateTime"
                    value={editingEvent.startDateTime}
                    onChange={handleChange}
                    min={getMinDateTime()} // Restrict to current date-time and future
                  />
                </td>
                <td data-label="End">
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    value={editingEvent.endDateTime}
                    onChange={handleChange}
                    min={editingEvent.startDateTime || getMinDateTime()} // Restrict to startDateTime or current date-time
                  />
                </td>
                <td data-label="Description">
                  <input name="description" value={editingEvent.description} onChange={handleChange} />
                </td>
                <td data-label="Contact">
                  <input name="contactNumber" value={editingEvent.contactNumber} onChange={handleChange} />
                </td>
                <td data-label="Email">
                  <input name="email" value={editingEvent.email} onChange={handleChange} />
                </td>
                <td data-label="Status" className={editingEvent.approved ? 'status-approved' : 'status-pending'}>
                  {editingEvent.approved ? 'Approved' : 'Pending'}
                </td>
                <td data-label="Actions">
                  <button className="btn btn-success mr-2" onClick={() => handleUpdate(editingEvent)}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditingEvent(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={event.id}>
                <td data-label="Name">{event.name}</td>
                <td data-label="Category">{event.category}</td>
                <td data-label="Location">{event.location}</td>
                <td data-label="Start">{formatDateTime(event.startDateTime)}</td>
                <td data-label="End">{formatDateTime(event.endDateTime)}</td>
                <td data-label="Description">{event.description}</td>
                <td data-label="Contact">{event.contactNumber}</td>
                <td data-label="Email">{event.email}</td>
                <td data-label="Status" className={event.approved ? 'status-approved' : 'status-pending'}>
                  {event.approved ? 'Approved' : 'Pending'}
                </td>
                <td data-label="Actions">
                  {!event.approved && <button className="btn btn-success mr-2" onClick={() => handleApprove(event)}>Approve</button>}
                  <button className="btn btn-primary mr-2" onClick={() => handleEdit(event)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;