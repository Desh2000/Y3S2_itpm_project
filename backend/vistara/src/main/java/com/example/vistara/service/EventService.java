package com.example.vistara.service;



import com.example.vistara.model.Event;
import com.example.vistara.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event updateEvent(Long id, Event event) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        existingEvent.setEventName(event.getEventName());
        existingEvent.setStartDate(event.getStartDate());
        existingEvent.setStartTime(event.getStartTime());
        existingEvent.setEndDate(event.getEndDate());
        existingEvent.setEndTime(event.getEndTime());
        existingEvent.setLocation(event.getLocation());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setEventType(event.getEventType());
        existingEvent.setContactNumber(event.getContactNumber());
        existingEvent.setEmail(event.getEmail());
        return eventRepository.save(existingEvent);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByEventType(category);
    }
}
