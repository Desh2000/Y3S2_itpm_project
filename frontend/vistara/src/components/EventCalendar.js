import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './EventCalendar.css'; // Import the custom CSS file
import 'react-calendar/dist/Calendar.css'; // Import default styles for the calendar

function EventCalendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            console.log('Fetched events:', response.data); // Debug: Log fetched events
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Mark dates on the calendar with a red dot for any events
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const currentDate = new Date(date);
            currentDate.setHours(0, 0, 0, 0); // Normalize to midnight to avoid timezone issues

            const eventsOnDate = events.filter(event => {
                const start = new Date(event.startDate);
                const end = new Date(event.endDate);
                start.setHours(0, 0, 0, 0); // Normalize start date
                end.setHours(0, 0, 0, 0);   // Normalize end date

                console.log(`Checking date ${currentDate.toDateString()} against ${start.toDateString()} to ${end.toDateString()}`); // Debug
                return currentDate >= start && currentDate <= end;
            });

            if (eventsOnDate.length === 0) return null;

            // Return the red dot
            return (
                <div className="react-calendar__tile-content">
                    •
                </div>
            );
        }
        return null;
    };

    // Display all events on the clicked date
    const onClickDay = (value) => {
        const currentDate = new Date(value);
        currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

        const eventsOnDate = events.filter(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            start.setHours(0, 0, 0, 0); // Normalize start date
            end.setHours(0, 0, 0, 0);   // Normalize end date

            return currentDate >= start && currentDate <= end;
        });
        setSelectedEvents(eventsOnDate);
        console.log('Selected events:', eventsOnDate); // Debug: Log selected events
    };

    // Function to convert 24-hour time to 12-hour time with AM/PM
    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Add a tileClassName to mark tiles with events
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const currentDate = new Date(date);
            currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

            const eventsOnDate = events.filter(event => {
                const start = new Date(event.startDate);
                const end = new Date(event.endDate);
                start.setHours(0, 0, 0, 0); // Normalize start date
                end.setHours(0, 0, 0, 0);   // Normalize end date

                return currentDate >= start && currentDate <= end;
            });
            if (eventsOnDate.length > 0) {
                console.log(`Adding class to ${currentDate.toDateString()}`); // Debug
                return 'react-calendar__tile--hasEvent';
            }
        }
        return null;
    };

    return (
        <div>
            <h2>Event Calendar</h2>
            <Calendar
                onChange={setDate}
                value={date}
                tileContent={tileContent}
                onClickDay={onClickDay}
                tileClassName={tileClassName} // Add class for event tiles
            />
            {selectedEvents.length > 0 && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Events on {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    {selectedEvents.map((event, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{event.eventName}</h4>
                            <p><strong>Location:</strong> {event.location || 'N/A'}</p>
                            <p><strong>Start Time:</strong> {formatTime(event.startTime)}</p>
                            <p><strong>End Time:</strong> {formatTime(event.endTime)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventCalendar;