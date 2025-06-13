package com.cms.cms.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.cms.dto.CreateStoryRequest;
import com.cms.cms.dto.StoryDTO;
import com.cms.cms.exception.ResourceNotFoundException;
import com.cms.cms.model.Story;
import com.cms.cms.repository.StoryRepository;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepository;
    
    // Get all active stories
    public List<StoryDTO> getAllActiveStories() {
        LocalDateTime now = LocalDateTime.now();
        List<Story> stories = storyRepository.findByActiveAndExpiresAtGreaterThanOrderByCreatedAtDesc(true, now);
        return stories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    // Get stories by author
    public List<StoryDTO> getStoriesByAuthor(String authorName) {
        LocalDateTime now = LocalDateTime.now();
        List<Story> stories = storyRepository.findByAuthorNameAndActiveAndExpiresAtGreaterThanOrderByCreatedAtDesc(
            authorName, true, now);
        return stories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    // Create a new story
    @Transactional
    public StoryDTO createStory(CreateStoryRequest request) {
        Story story = new Story();
        story.setMediaContent(request.getMediaContent());
        story.setCaption(request.getCaption());
        story.setCreatedAt(LocalDateTime.now());
        story.setExpiresAt(LocalDateTime.now().plusHours(24)); // Stories expire after 24 hours
        story.setAuthorName(request.getAuthorName());
        story.setAuthorAvatar(request.getAuthorAvatar());
        story.setActive(true);
        story.setBackgroundColor(request.getBackgroundColor());
        story.setMediaType(request.getMediaType());
        story.setViews(0);
        
        Story savedStory = storyRepository.save(story);
        return convertToDTO(savedStory);
    }
    
    // View a story (increment view count)
    @Transactional
    public StoryDTO viewStory(Long id) {
        Story story = storyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        
        // Check if story is still active
        if (!story.isActive() || story.getExpiresAt().isBefore(LocalDateTime.now())) {
            story.setActive(false);
            storyRepository.save(story);
            throw new ResourceNotFoundException("Story has expired");
        }
        
        // Increment view count
        story.setViews(story.getViews() + 1);
        storyRepository.save(story);
        
        return convertToDTO(story);
    }
    
    // Delete a story
    @Transactional
    public void deleteStory(Long id) {
        Story story = storyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        storyRepository.delete(story);
    }
    
    // Check for expired stories and mark them as inactive
    @Transactional
    public void checkAndUpdateExpiredStories() {
        LocalDateTime now = LocalDateTime.now();
        List<Story> allStories = storyRepository.findAll();
        
        allStories.forEach(story -> {
            if (story.isActive() && story.getExpiresAt().isBefore(now)) {
                story.setActive(false);
                storyRepository.save(story);
            }
        });
    }
    
    // Convert Story entity to StoryDTO
    private StoryDTO convertToDTO(Story story) {
        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setMediaContent(story.getMediaContent());
        dto.setCaption(story.getCaption());
        dto.setCreatedAt(story.getCreatedAt());
        dto.setExpiresAt(story.getExpiresAt());
        dto.setAuthorName(story.getAuthorName());
        dto.setAuthorAvatar(story.getAuthorAvatar());
        dto.setActive(story.isActive());
        dto.setBackgroundColor(story.getBackgroundColor());
        dto.setMediaType(story.getMediaType());
        dto.setViews(story.getViews());
        
        // Calculate if the story is expired
        if (story.getExpiresAt().isBefore(LocalDateTime.now())) {
            dto.setActive(false);
        }
        
        return dto;
    }
} 