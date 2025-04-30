package com.cms.cms.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String mediaContent; // Base64 encoded image or video
    
    @Column(length = 200)
    private String caption; // Optional caption for the story
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt; // Stories expire after 24 hours
    
    @Column(nullable = false)
    private String authorName;
    
    private String authorAvatar;
    
    @Column(nullable = false)
    private boolean active = true; // Whether the story is still active or expired
    
    private String backgroundColor; // For text-only stories
    
    private String mediaType; // "image", "video", or "text"
    
    private int views = 0; // Count of views
} 