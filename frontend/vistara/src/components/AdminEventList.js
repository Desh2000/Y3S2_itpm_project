import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminEventList() {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            console.log('Fetched events:', response.data);
            setEvents(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to fetch events. Check console for details.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/events/${id}`);
            fetchEvents();
            setError(null);
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event.');
        }
    };

    const handlePost = (event) => {
        console.log('Posting event data to /newevent:', event);
        // Simulate marking the event as posted (you'd need to update your backend API to set isPosted: true)
        const updatedEvent = { ...event, isPosted: true };
        navigate('/newevent', { state: { event: updatedEvent } });
        // Here you would typically call an API to update the event's isPosted status
    };

    const handleEdit = (event) => {
        setEditingEvent(event.eventId);
        setFormData({ ...event });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/events/${id}`, formData);
            setEditingEvent(null);
            fetchEvents();
            setError(null);
        } catch (error) {
            console.error('Error updating event:', error);
            setError('Failed to update event.');
        }
    };

    const handleCancel = () => {
        setEditingEvent(null);
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                    <tr style={{ border: '1px solid black' }}>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Start Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Start Time</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>End Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>End Time</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Location</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Contact</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>
                                No events found.
                            </td>
                        </tr>
                    ) : (
                        events.map((event) => (
                            <tr key={event.eventId} style={{ border: '1px solid black' }}>
                                {editingEvent === event.eventId ? (
                                    <>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="eventName" value={formData.eventName || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="startDate" type="date" value={formData.startDate || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="startTime" type="time" value={formData.startTime || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="endDate" type="date" value={formData.endDate || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="endTime" type="time" value={formData.endTime || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="location" value={formData.location || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <textarea name="description" value={formData.description || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="eventType" value={formData.eventType || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="contactNumber" value={formData.contactNumber || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <input name="email" value={formData.email || ''} onChange={handleInputChange} />
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <button onClick={() => handleUpdate(event.eventId)}>Save</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.eventName || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.startDate || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.startTime || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.endDate || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.endTime || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.location || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.description || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.eventType || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.contactNumber || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{event.email || 'N/A'}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            {!event.isPosted ? (
                                                <>
                                                    <button onClick={() => handleEdit(event)}>Update</button>
                                                    <button onClick={() => handleDelete(event.eventId)}>Delete</button>
                                                    <button onClick={() => handlePost(event)}>Post</button>
                                                </>
                                            ) : (
                                                <span>Posted - No further actions allowed</span>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminEventList;