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

import com.cms.cms.dto.CommentDTO;
import com.cms.cms.service.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*") // Allow requests from any origin for development
@Tag(name = "Comment", description = "Comment management APIs")
public class CommentController {

    @Autowired
    private CommentService commentService;
    
    @Operation(summary = "Get comments by announcement ID", description = "Retrieves all comments for a specific announcement")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommentDTO.class))),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @GetMapping("/announcement/{announcementId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByAnnouncementId(
            @Parameter(description = "ID of the announcement to get comments for", required = true) @PathVariable Long announcementId) {
        try {
            List<CommentDTO> comments = commentService.getCommentsByAnnouncementId(announcementId);
            return ResponseEntity.ok(comments);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Create a new comment", description = "Adds a new comment to an announcement")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommentDTO.class))),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @PostMapping("/announcement/{announcementId}")
    public ResponseEntity<CommentDTO> createComment(
            @Parameter(description = "ID of the announcement to comment on", required = true) @PathVariable Long announcementId,
            @Parameter(description = "Comment details", required = true) @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO createdComment = commentService.createComment(announcementId, commentDTO);
            return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Delete a comment", description = "Deletes a comment by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comment deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comment not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "ID of the comment to delete", required = true) @PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 