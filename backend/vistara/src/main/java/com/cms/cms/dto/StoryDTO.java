package com.cms.cms.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryDTO {
    
    private Long id;
    private String mediaContent;
    private String caption;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String authorName;
    private String authorAvatar;
    private boolean active;
    private String backgroundColor;
    private String mediaType;
    private int views;
    
    // Helper field to determine if the story has been viewed by the current user
    private boolean viewed = false;
} 