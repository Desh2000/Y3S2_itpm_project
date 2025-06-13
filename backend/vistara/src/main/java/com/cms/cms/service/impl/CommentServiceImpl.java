package com.cms.cms.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.cms.dto.CommentDTO;
import com.cms.cms.model.Announcement;
import com.cms.cms.model.Comment;
import com.cms.cms.repository.AnnouncementRepository;
import com.cms.cms.repository.CommentRepository;
import com.cms.cms.service.CommentService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private AnnouncementRepository announcementRepository;

    @Override
    public List<CommentDTO> getCommentsByAnnouncementId(Long announcementId) {
        // Verify announcement exists
        if (!announcementRepository.existsById(announcementId)) {
            throw new EntityNotFoundException("Announcement not found with id: " + announcementId);
        }
        
        List<Comment> comments = commentRepository.findByAnnouncementId(announcementId);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO createComment(Long announcementId, CommentDTO commentDTO) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found with id: " + announcementId));
        
        Comment comment = new Comment();
        comment.setAuthor(commentDTO.getAuthor());
        comment.setText(commentDTO.getText());
        comment.setTimestamp(LocalDateTime.now());
        comment.setAnnouncement(announcement);
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setAuthor(comment.getAuthor());
        dto.setText(comment.getText());
        dto.setTimestamp(comment.getTimestamp());
        
        // Format timestamp as "X time ago"
        dto.setFormattedTimestamp(formatTimeAgo(comment.getTimestamp()));
        
        return dto;
    }
    
    private String formatTimeAgo(LocalDateTime timestamp) {
        java.time.Duration duration = java.time.Duration.between(timestamp, LocalDateTime.now());
        
        long seconds = duration.getSeconds();
        
        if (seconds < 60) {
            return "Just now";
        } else if (seconds < 3600) {
            long minutes = seconds / 60;
            return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        } else if (seconds < 86400) {
            long hours = seconds / 3600;
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        } else {
            long days = seconds / 86400;
            return days + " day" + (days > 1 ? "s" : "") + " ago";
        }
    }
} 