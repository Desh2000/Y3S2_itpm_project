package com.cms.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateStoryRequest {
    
    private String mediaContent; // Base64 encoded media content
    private String caption;
    private String authorName;
    private String authorAvatar;
    private String backgroundColor; // For text-only stories
    private String mediaType; // "image", "video", or "text"
} 