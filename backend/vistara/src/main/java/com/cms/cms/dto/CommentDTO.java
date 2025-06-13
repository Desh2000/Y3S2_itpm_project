package com.cms.cms.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String author;
    private String text;
    private LocalDateTime timestamp;
    private String formattedTimestamp; // For displaying "2 hours ago", etc.
} 