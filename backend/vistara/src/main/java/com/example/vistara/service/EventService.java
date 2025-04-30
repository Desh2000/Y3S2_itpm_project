package com.example.vistara.service;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private com.example.vistara.repository.EventRepository eventRepository;

    public com.example.vistara.model.Event createEvent(com.example.vistara.model.Event event) {
        return eventRepository.save(event);
    }

    public List<com.example.vistara.model.Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public com.example.vistara.model.Event updateEvent(Long id, com.example.vistara.model.Event event) {
        com.example.vistara.model.Event existingEvent = eventRepository.findById(id)
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

    public List<com.example.vistara.model.Event> getEventsByCategory(String category) {
        return eventRepository.findByEventType
        (category);
    }
}
