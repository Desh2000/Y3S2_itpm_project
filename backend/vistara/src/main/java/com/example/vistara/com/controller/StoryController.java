package com.cms.cms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.dto.CreateStoryRequest;
import com.cms.cms.dto.StoryDTO;
import com.cms.cms.service.StoryService;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {

    @Autowired
    private StoryService storyService;
    
    // Get all active stories
    @GetMapping
    public ResponseEntity<List<StoryDTO>> getAllActiveStories() {
        List<StoryDTO> stories = storyService.getAllActiveStories();
        return ResponseEntity.ok(stories);
    }
    
    // Get stories by author
    @GetMapping("/author/{authorName}")
    public ResponseEntity<List<StoryDTO>> getStoriesByAuthor(@PathVariable String authorName) {
        List<StoryDTO> stories = storyService.getStoriesByAuthor(authorName);
        return ResponseEntity.ok(stories);
    }
    
    // Create a new story
    @PostMapping
    public ResponseEntity<StoryDTO> createStory(@RequestBody CreateStoryRequest request) {
        StoryDTO createdStory = storyService.createStory(request);
        return new ResponseEntity<>(createdStory, HttpStatus.CREATED);
    }
    
    // View a story (increment view count)
    @PostMapping("/{id}/view")
    public ResponseEntity<StoryDTO> viewStory(@PathVariable Long id) {
        StoryDTO viewedStory = storyService.viewStory(id);
        return ResponseEntity.ok(viewedStory);
    }
    
    // Delete a story
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }
    
    // Check and update expired stories (can be called periodically)
    @PostMapping("/check-expired")
    public ResponseEntity<Void> checkExpiredStories() {
        storyService.checkAndUpdateExpiredStories();
        return ResponseEntity.ok().build();
    }
} 