package com.cms.cms.service;

import java.util.List;

import com.cms.cms.dto.CommentDTO;

public interface CommentService {
    List<CommentDTO> getCommentsByAnnouncementId(Long announcementId);
    CommentDTO createComment(Long announcementId, CommentDTO commentDTO);
    void deleteComment(Long id);
} 