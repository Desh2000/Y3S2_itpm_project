import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function NewEvent() {
    const location = useLocation();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        // Get the event data passed through navigation state
        if (location.state && location.state.event) {
            setEvent(location.state.event);
        }
    }, [location]);

    // Function to format the event details as per the requirement
    const formatEventDetails = (event) => {
        if (!event) return '';

        return (
            `name is ${event.eventName || 'N/A'} ` +
            `start on ${event.startDate || 'N/A'} at ${event.startTime || 'N/A'} ` +
            `end on ${event.endDate || 'N/A'} at ${event.endTime || 'N/A'} ` +
            `at ${event.location || 'N/A'} ` +
            `description is ${event.description || 'N/A'} ` +
            `it end Category ${event.eventType || 'N/A'}`
        );
    };

    return (
        <div>
            <h2>Posted Event Details</h2>
            {event ? (
                <div>
                    <p>{formatEventDetails(event)}</p>
                </div>
            ) : (
                <p>No event data available to display.</p>
            )}
        </div>
    );
}

export default NewEvent;