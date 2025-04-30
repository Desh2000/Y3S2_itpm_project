import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateEvent() {
  const [event, setEvent] = useState({
    name: '',
    category: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    contactNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    // Event Name Validation
    if (!event.name.trim()) {
      newErrors.name = 'Event Name is required';
    } else if (event.name.length < 3) {
      newErrors.name = 'Event Name must be at least 3 characters long';
    } else if (event.name.length > 100) {
      newErrors.name = 'Event Name cannot exceed 100 characters';
    }

    // Category Validation
    if (!event.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (event.category.length < 3) {
      newErrors.category = 'Category must be at least 3 characters long';
    } else if (event.category.length > 50) {
      newErrors.category = 'Category cannot exceed 50 characters';
    }

    // Start Date & Time Validation
    if (!event.startDateTime) {
      newErrors.startDateTime = 'Start Date & Time is required';
    } else {
      const startDate = new Date(event.startDateTime);
      const now = new Date();
      if (isNaN(startDate.getTime())) {
        newErrors.startDateTime = 'Invalid Start Date & Time';
      } else if (startDate <= now) {
        newErrors.startDateTime = 'Start Date & Time must be in the future';
      }
    }

    // End Date & Time Validation
    if (!event.endDateTime) {
      newErrors.endDateTime = 'End Date & Time is required';
    } else {
      const endDate = new Date(event.endDateTime);
      const startDate = new Date(event.startDateTime);
      if (isNaN(endDate.getTime())) {
        newErrors.endDateTime = 'Invalid End Date & Time';
      } else if (event.startDateTime && endDate <= startDate) {
        newErrors.endDateTime = 'End Date & Time must be after Start Date & Time';
      }
    }

    // Location Validation
    if (!event.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (event.location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    } else if (event.location.length > 100) {
      newErrors.location = 'Location cannot exceed 100 characters';
    }

    // Description Validation
    if (!event.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (event.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (event.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    // Contact Number Validation
    const phoneRegex = /^(?:\+94\d{9}|0\d{9})$/; // Matches +94 followed by 9 digits or 0 followed by 9 digits
    if (!event.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!phoneRegex.test(event.contactNumber)) {
      newErrors.contactNumber = 'Invalid Contact Number (e.g., +94712345678 or 0712345678)';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    if (!event.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(event.email)) {
      newErrors.email = 'Invalid Email format (e.g., user@example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const eventToSubmit = {
          ...event,
          startDateTime: new Date(event.startDateTime).toISOString(),
          endDateTime: new Date(event.endDateTime).toISOString()
        };
        await axios.post('http://localhost:8080/api/events', eventToSubmit);
        // Show success pop-up message
        alert('Event created successfully!');
        navigate('/admin');
      } catch (error) {
        console.error('Error creating event:', error);
        // Show error pop-up message
        alert('Failed to create event. Please try again.');
      }
    } else {
      // Show validation error pop-up message
      alert('Please correct the errors in the form before submitting.');
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="container">
      <style>
        {`
          /* Define CSS variables for consistent theming */
          :root {
            --primary-color: #007bff;
            --secondary-color: #6c757d;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --background-color: #f8f9fa;
            --text-color: #333;
            --border-color: #dee2e6;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
          }

          /* Container styling */
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: var(--shadow);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          /* Heading styling */
          h1 {
            font-size: 2rem;
            color: var(--text-color);
            text-align: center;
            margin-bottom: 30px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          /* Form styling */
          form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          /* Form group styling */
          .mb-3 {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          /* Label styling */
          label {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 5px;
          }

          /* Input and textarea styling */
          .form-control {
            padding: 12px 15px;
            font-size: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: var(--transition);
            background-color: #f9f9f9;
            color: var(--text-color);
          }

          .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            background-color: #fff;
          }

          /* Textarea specific styling */
          textarea.form-control {
            min-height: 120px;
            resize: vertical;
          }

          /* Invalid input styling */
          .form-control.is-invalid {
            border-color: var(--danger-color);
            background-color: #fff5f5;
          }

          .invalid-feedback {
            font-size: 0.875rem;
            color: var(--danger-color);
            margin-top: 5px;
          }

          /* Button container for Submit and Cancel */
          .button-group {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          }

          /* Submit button styling */
          .btn-primary {
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            background-color: var(--primary-color);
            color: #fff;
            cursor: pointer;
            transition: var(--transition);
            min-width: 150px;
          }

          .btn-primary:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
          }

          .btn-primary:active {
            transform: translateY(0);
            box-shadow: none;
          }

          /* Cancel button styling */
          .btn-secondary {
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            background-color: var(--secondary-color);
            color: #fff;
            cursor: pointer;
            transition: var(--transition);
            min-width: 150px;
          }

          .btn-secondary:hover {
            background-color: #5a6268;
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(108, 117, 125, 0.3);
          }

          .btn-secondary:active {
            transform: translateY(0);
            box-shadow: none;
          }

          /* Responsive adjustments */
          @media (max-width: 576px) {
            .container {
              margin: 20px;
              padding: 20px;
              border-radius: 10px;
            }

            h1 {
              font-size: 1.5rem;
              margin-bottom: 20px;
            }

            .form-control {
              padding: 10px 12px;
              font-size: 0.9rem;
            }

            .btn-primary,
            .btn-secondary {
              padding: 10px 18px;
              font-size: 0.9rem;
              min-width: 120px;
            }

            label {
              font-size: 0.9rem;
            }

            .invalid-feedback {
              font-size: 0.8rem;
            }

            .button-group {
              flex-direction: column;
              gap: 10px;
            }
          }
        `}
      </style>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Event Name:</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.name}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.category}
          />
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>
        <div className="mb-3">
          <label>Start Date & Time:</label>
          <input
            type="datetime-local"
            name="startDateTime"
            className={`form-control ${errors.startDateTime ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.startDateTime}
            min={getMinDateTime()} // Restrict to current date-time and future
          />
          {errors.startDateTime && <div className="invalid-feedback">{errors.startDateTime}</div>}
        </div>
        <div className="mb-3">
          <label>End Date & Time:</label>
          <input
            type="datetime-local"
            name="endDateTime"
            className={`form-control ${errors.endDateTime ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.endDateTime}
            min={event.startDateTime || getMinDateTime()} // Restrict to startDateTime or current date-time
          />
          {errors.endDateTime && <div className="invalid-feedback">{errors.endDateTime}</div>}
        </div>
        <div className="mb-3">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.location}
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>
        <div className="mb-3">
          <label>Description:</label>
          <textarea
            name="description"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.description}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        <div className="mb-3">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.contactNumber}
          />
          {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            onChange={handleChange}
            value={event.email}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;