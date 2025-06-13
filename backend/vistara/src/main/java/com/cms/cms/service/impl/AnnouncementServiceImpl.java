package com.cms.cms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.cms.dto.AnnouncementDTO;
import com.cms.cms.dto.CommentDTO;
import com.cms.cms.model.Announcement;
import com.cms.cms.model.Comment;
import com.cms.cms.repository.AnnouncementRepository;
import com.cms.cms.service.AnnouncementService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Override
    public List<AnnouncementDTO> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return announcements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementDTO getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found with id: " + id));
        return convertToDTO(announcement);
    }

    @Override
    @Transactional
    public AnnouncementDTO createAnnouncement(AnnouncementDTO announcementDTO) {
        Announcement announcement = convertToEntity(announcementDTO);
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return convertToDTO(savedAnnouncement);
    }

    @Override
    @Transactional
    public AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO announcementDTO) {
        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found with id: " + id));
        
        existingAnnouncement.setContent(announcementDTO.getContent());
        existingAnnouncement.setStartDate(announcementDTO.getStartDate());
        
        // Only update image if provided
        if (announcementDTO.getImage() != null) {
            existingAnnouncement.setImage(announcementDTO.getImage());
        }
        
        existingAnnouncement.setAuthorName(announcementDTO.getAuthorName());
        
        if (announcementDTO.getAuthorAvatar() != null) {
            existingAnnouncement.setAuthorAvatar(announcementDTO.getAuthorAvatar());
        }
        
        // Update mediaType and backgroundColor
        if (announcementDTO.getMediaType() != null) {
            existingAnnouncement.setMediaType(announcementDTO.getMediaType());
        }
        
        if (announcementDTO.getMediaType() != null && announcementDTO.getMediaType().equals("text")) {
            existingAnnouncement.setBackgroundColor(announcementDTO.getBackgroundColor());
        }
        
        existingAnnouncement.setLikes(announcementDTO.getLikes());
        
        Announcement updatedAnnouncement = announcementRepository.save(existingAnnouncement);
        return convertToDTO(updatedAnnouncement);
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new EntityNotFoundException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AnnouncementDTO likeAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found with id: " + id));
        
        announcement.setLikes(announcement.getLikes() + 1);
        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        
        return convertToDTO(updatedAnnouncement);
    }
    
    // Helper methods for DTO conversion
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setContent(announcement.getContent());
        dto.setStartDate(announcement.getStartDate());
        dto.setImage(announcement.getImage());
        dto.setAuthorName(announcement.getAuthorName());
        dto.setAuthorAvatar(announcement.getAuthorAvatar());
        dto.setLikes(announcement.getLikes());
        dto.setBackgroundColor(announcement.getBackgroundColor());
        dto.setMediaType(announcement.getMediaType());
        
        // Convert comments
        List<CommentDTO> commentDTOs = announcement.getComments().stream()
                .map(this::convertCommentToDTO)
                .collect(Collectors.toList());
        dto.setComments(commentDTOs);
        
        return dto;
    }
    
    private Announcement convertToEntity(AnnouncementDTO dto) {
        Announcement entity = new Announcement();
        entity.setId(dto.getId());
        entity.setContent(dto.getContent());
        entity.setStartDate(dto.getStartDate());
        entity.setImage(dto.getImage());
        entity.setAuthorName(dto.getAuthorName());
        entity.setAuthorAvatar(dto.getAuthorAvatar());
        entity.setLikes(dto.getLikes());
        entity.setBackgroundColor(dto.getBackgroundColor());
        entity.setMediaType(dto.getMediaType());
        
        // Comments are handled separately through CommentService
        
        return entity;
    }
    
    private CommentDTO convertCommentToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setAuthor(comment.getAuthor());
        dto.setText(comment.getText());
        dto.setTimestamp(comment.getTimestamp());
        
        // Format timestamp as "X time ago"
        dto.setFormattedTimestamp(formatTimeAgo(comment.getTimestamp()));
        
        return dto;
    }
    
    private String formatTimeAgo(java.time.LocalDateTime timestamp) {
        java.time.Duration duration = java.time.Duration.between(timestamp, java.time.LocalDateTime.now());
        
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