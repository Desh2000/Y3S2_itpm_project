import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventForm({ onEventCreated }) {
    const [event, setEvent] = useState({
        eventName: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        description: '',
        eventType: '',
        contactNumber: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [existingEvents, setExistingEvents] = useState([]); // Store existing events
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Fetch existing events on component mount
    useEffect(() => {
        const fetchExistingEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events');
                console.log('Fetched existing events:', response.data); // Debug: Log fetched events
                setExistingEvents(response.data);
            } catch (error) {
                console.error('Error fetching existing events:', error);
            }
        };
        fetchExistingEvents();

        // Set min date to today (no max to allow future dates)
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.min = today;
            input.removeAttribute('max');
        });
    }, [today]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Fetch the latest events before validation
        const refreshedEventsResponse = await axios.get('http://localhost:8080/api/events');
        const refreshedEvents = refreshedEventsResponse.data;
        setExistingEvents(refreshedEvents);
        console.log('Refreshed existing events:', refreshedEvents); // Debug

        const newErrors = validateForm(refreshedEvents);
        if (Object.keys(newErrors).length === 0) {
            console.log('Submitting event:', event);
            try {
                const response = await axios.post('http://localhost:8080/api/events', event);
                console.log('Response from backend:', response.data);
                onEventCreated(response.data);
                setEvent({
                    eventName: '',
                    startDate: '',
                    startTime: '',
                    endDate: '',
                    endTime: '',
                    location: '',
                    description: '',
                    eventType: '',
                    contactNumber: '',
                    email: ''
                });
                setErrors({});
                // Refresh existing events after adding a new one
                const updatedEvents = await axios.get('http://localhost:8080/api/events');
                setExistingEvents(updatedEvents.data);
            } catch (error) {
                console.error('Error creating event:', error);
                alert('Failed to create the event. Please try again later.');
                setErrors({ submit: 'Failed to create event. Please try again.' });
            }
        } else {
            setErrors(newErrors);
        }
    };

    const normalizeTime = (time) => {
        if (!time) return null;
        // If time is in "HH:MM" format, append ":00"; if already "HH:MM:SS", keep as is
        const parts = time.split(':');
        if (parts.length === 2) {
            return `${time}:00`; // Convert "18:00" to "18:00:00"
        }
        return time; // Already "18:00:00"
    };

    const validateForm = (events) => {
        const newErrors = {};

        // Validate event name
        if (!event.eventName.trim()) {
            newErrors.eventName = 'Please enter the event name.';
        }

        // Validate dates
        if (!event.startDate || !event.endDate) {
            newErrors.dates = 'Both start date and end date are required.';
        } else {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const todayDate = new Date(today);
            todayDate.setHours(0, 0, 0, 0); // Normalize today to midnight
            if (start < todayDate || end < todayDate) {
                newErrors.dates = 'Dates cannot be in the past.';
            }
            if (start > end) {
                newErrors.dates = 'Start date cannot be after end date.';
            }
        }

        // Validate times
        if (event.startTime && event.endTime && event.startDate && event.endDate) {
            const normalizedStartTime = normalizeTime(event.startTime);
            const normalizedEndTime = normalizeTime(event.endTime);
            if (!normalizedStartTime || !normalizedEndTime) {
                newErrors.times = 'Invalid start or end time format. Please use HH:MM format.';
                return newErrors;
            }

            const startDateTime = new Date(`${event.startDate}T${normalizedStartTime}`);
            const endDateTime = new Date(`${event.endDate}T${normalizedEndTime}`);
            if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                alert('Invalid start or end time format. Please use a valid time (e.g., 18:00 for 6:00 PM).');
                newErrors.times = 'Invalid start or end time format.';
                return newErrors;
            }
            startDateTime.setMinutes(0); // Normalize to exact hour
            endDateTime.setMinutes(0);   // Normalize to exact hour
            const startHour = parseInt(event.startTime.split(':')[0]);
            const endHour = parseInt(event.endTime.split(':')[0]);
            const startPeriod = startHour >= 12 ? 'PM' : 'AM';
            const endPeriod = endHour >= 12 ? 'PM' : 'AM';

            // Check if start time is PM and end time is AM on the same day
            if (event.startDate === event.endDate && startPeriod === 'PM' && endPeriod === 'AM') {
                newErrors.times = 'Start time cannot be PM if end time is AM on the same day.';
            }

            // Check if start time is after end time on the same day (e.g., 2:00 PM to 1:00 PM)
            if (event.startDate === event.endDate && startDateTime > endDateTime) {
                newErrors.times = 'Start time cannot be after end time on the same day.';
            }
        }

        // Check for overlapping events (including exact matches)
        if (event.startDate && event.endDate && event.startTime && event.endTime) {
            const normalizedStartTime = normalizeTime(event.startTime);
            const normalizedEndTime = normalizeTime(event.endTime);
            const startDateTime = new Date(`${event.startDate}T${normalizedStartTime}`);
            const endDateTime = new Date(`${event.endDate}T${normalizedEndTime}`);
            if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                alert('Invalid start or end time format. Please use a valid time (e.g., 18:00 for 6:00 PM).');
                newErrors.times = 'Invalid start or end time format.';
                return newErrors;
            }
            startDateTime.setMinutes(0); // Normalize to exact hour
            endDateTime.setMinutes(0);   // Normalize to exact hour
            console.log('New event raw times:', { startTime: event.startTime, endTime: event.endTime }); // Debug
            console.log('New event:', { start: startDateTime, end: endDateTime }); // Debug

            const overlaps = events.some(existingEvent => {
                const normalizedExistingStartTime = normalizeTime(existingEvent.startTime);
                const normalizedExistingEndTime = normalizeTime(existingEvent.endTime);
                if (!normalizedExistingStartTime || !normalizedExistingEndTime) {
                    console.log('Skipping invalid existing event time:', existingEvent);
                    return false;
                }
                const existingStart = new Date(`${existingEvent.startDate}T${normalizedExistingStartTime}`);
                const existingEnd = new Date(`${existingEvent.endDate}T${normalizedExistingEndTime}`);
                if (isNaN(existingStart.getTime()) || isNaN(existingEnd.getTime())) {
                    console.log('Invalid existing event time:', existingEvent);
                    return false;
                }
                existingStart.setMinutes(0); // Normalize to exact hour
                existingEnd.setMinutes(0);   // Normalize to exact hour
                console.log('Existing event raw times:', { startTime: existingEvent.startTime, endTime: existingEvent.endTime }); // Debug
                console.log('Existing event:', { start: existingStart, end: existingEnd }); // Debug
                const overlap = startDateTime <= existingEnd && endDateTime >= existingStart;
                console.log('Overlap check:', overlap); // Debug
                return overlap;
            });
            if (overlaps) {
                newErrors.overlap = 'This event overlaps with an existing event.';
            }
        }

        // Validate contact number
        if (event.contactNumber && !/^\d{10}$/.test(event.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
        }

        // Validate email
        if (event.email && !event.email.endsWith('@gmail.com')) {
            newErrors.email = 'Email must end with @gmail.com.';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        if (errors.dates && (name === 'startDate' || name === 'endDate')) {
            setErrors({ ...errors, dates: '' });
        }
        if (errors.times && (name === 'startTime' || name === 'endTime')) {
            setErrors({ ...errors, times: '' });
        }
        if (errors.overlap && (name === 'startDate' || name === 'endDate' || name === 'startTime' || name === 'endTime')) {
            setErrors({ ...errors, overlap: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Enter the event name:</label>
                <input
                    name="eventName"
                    value={event.eventName}
                    onChange={handleChange}
                    placeholder="e.g., Team Meeting"
                    required
                />
                {errors.eventName && <p style={{ color: 'red' }}>{errors.eventName}</p>}
            </div>

            <div>
                <label>Enter the start date:</label>
                <input
                    name="startDate"
                    type="date"
                    value={event.startDate}
                    onChange={handleChange}
                    required
                />
                <label>Enter the end date:</label>
                <input
                    name="endDate"
                    type="date"
                    value={event.endDate}
                    onChange={handleChange}
                    required
                />
                {errors.dates && <p style={{ color: 'red' }}>{errors.dates}</p>}
            </div>

            <div>
                <label>Enter the start time:</label>
                <input
                    name="startTime"
                    type="time"
                    value={event.startTime}
                    onChange={handleChange}
                    required
                />
                <label>Enter the end time:</label>
                <input
                    name="endTime"
                    type="time"
                    value={event.endTime}
                    onChange={handleChange}
                    required
                />
                {errors.times && <p style={{ color: 'red' }}>{errors.times}</p>}
            </div>

            <div>
                <label>Enter the location:</label>
                <input
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="e.g., Office"
                    required
                />
            </div>

            <div>
                <label>Enter the description:</label>
                <textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="e.g., Team discussion"
                />
            </div>

            <div>
                <label>Enter the category:</label>
                <input
                    name="eventType"
                    value={event.eventType}
                    onChange={handleChange}
                    placeholder="e.g., Meeting"
                    required
                />
            </div>

            <div>
                <label>Enter the contact number:</label>
                <input
                    name="contactNumber"
                    value={event.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g., 1234567890"
                />
                {errors.contactNumber && <p style={{ color: 'red' }}>{errors.contactNumber}</p>}
            </div>

            <div>
                <label>Enter the email:</label>
                <input
                    name="email"
                    value={event.email}
                    onChange={handleChange}
                    placeholder="e.g., user@gmail.com"
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            <button type="submit">Create Event</button>
            {errors.overlap && <p style={{ color: 'red' }}>{errors.overlap}</p>}
            {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        </form>
    );
}

export default EventForm;