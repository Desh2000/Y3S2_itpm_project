package com.cms.cms.controller;

import com.cms.cms.model.Event;
import com.cms.cms.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        System.out.println("All events: " + events); // Debug log
        return events;
    }

    @GetMapping("/approved")
    public List<Event> getApprovedEvents() {
        List<Event> approvedEvents = eventRepository.findAll().stream()
                .filter(Event::isApproved)
                .collect(Collectors.toList());
        System.out.println("Approved events: " + approvedEvents); // Debug log
        return approvedEvents;
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        Event savedEvent = eventRepository.save(event);
        System.out.println("Created event: " + savedEvent); // Debug log
        return savedEvent;
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        Event existingEvent = eventRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found")
        );
        existingEvent.setName(event.getName());
        existingEvent.setCategory(event.getCategory());
        existingEvent.setStartDateTime(event.getStartDateTime());
        existingEvent.setEndDateTime(event.getEndDateTime());
        existingEvent.setLocation(event.getLocation());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setContactNumber(event.getContactNumber());
        existingEvent.setEmail(event.getEmail());
        existingEvent.setApproved(event.isApproved());
        Event updatedEvent = eventRepository.save(existingEvent);
        System.out.println("Updated event: " + updatedEvent); // Debug log
        return updatedEvent;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        try {
            eventRepository.deleteById(id);
            System.out.println("Deleted event with id: " + id); // Debug log
            return new ResponseEntity<>("Event deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting event", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Event> approveEvent(@PathVariable Long id) {
        try {
            Event event = eventRepository.findById(id).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found")
            );
            event.setApproved(true);
            Event approvedEvent = eventRepository.save(event);
            System.out.println("Approved event: " + approvedEvent); // Debug log
            return new ResponseEntity<>(approvedEvent, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}