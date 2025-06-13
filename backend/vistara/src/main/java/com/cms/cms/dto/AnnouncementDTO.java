package com.cms.cms.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
    private Long id;
    private String content;
    private LocalDateTime startDate;
    private String image; // Base64 encoded image
    private String authorName;
    private String authorAvatar;
    private int likes;
    private String backgroundColor; // For text-only announcements
    private String mediaType = "image"; // "image" or "text"
    private List<CommentDTO> comments = new ArrayList<>();
} 