package com.cms.cms.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cms.cms.dto.AnnouncementDTO;
import com.cms.cms.service.AnnouncementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*") // Allow requests from any origin for development
@Tag(name = "Announcement", description = "Announcement management APIs")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;
    
    @Operation(summary = "Get all announcements", description = "Retrieves all announcements from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all announcements",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }
    
    @Operation(summary = "Get announcement by ID", description = "Retrieves a specific announcement by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the announcement",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class))),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(
            @Parameter(description = "ID of the announcement to retrieve") @PathVariable Long id) {
        try {
            AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
            return ResponseEntity.ok(announcement);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Create a new announcement", description = "Creates a new announcement with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Announcement created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class)))
    })
    @PostMapping
    public ResponseEntity<AnnouncementDTO> createAnnouncement(
            @Parameter(description = "Announcement details to create", required = true) @RequestBody AnnouncementDTO announcementDTO) {
        // Set the start date to now if not provided
        if (announcementDTO.getStartDate() == null) {
            announcementDTO.setStartDate(LocalDateTime.now());
        }
        
        AnnouncementDTO createdAnnouncement = announcementService.createAnnouncement(announcementDTO);
        return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Create a new announcement with image", description = "Creates a new announcement with an uploaded image")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Announcement created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping("/upload")
    public ResponseEntity<AnnouncementDTO> createAnnouncementWithImage(
            @Parameter(description = "Announcement content", required = true) @RequestParam("content") String content,
            @Parameter(description = "Image file to upload") @RequestParam(value = "image", required = false) MultipartFile image,
            @Parameter(description = "Author name", required = true) @RequestParam("authorName") String authorName,
            @Parameter(description = "Author avatar URL") @RequestParam(value = "authorAvatar", required = false) String authorAvatar,
            @Parameter(description = "Background color for text-only posts") @RequestParam(value = "backgroundColor", required = false) String backgroundColor,
            @Parameter(description = "Media type (image or text)") @RequestParam(value = "mediaType", defaultValue = "image") String mediaType) {
        
        try {
            AnnouncementDTO announcementDTO = new AnnouncementDTO();
            announcementDTO.setContent(content);
            announcementDTO.setStartDate(LocalDateTime.now());
            announcementDTO.setAuthorName(authorName);
            announcementDTO.setAuthorAvatar(authorAvatar);
            announcementDTO.setMediaType(mediaType);
            
            // Set background color for text-only announcements
            if ("text".equals(mediaType)) {
                announcementDTO.setBackgroundColor(backgroundColor);
            }
            
            // Convert image to Base64 if provided and it's an image type post
            if ("image".equals(mediaType) && image != null && !image.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                announcementDTO.setImage(base64Image);
            }
            
            AnnouncementDTO createdAnnouncement = announcementService.createAnnouncement(announcementDTO);
            return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @Operation(summary = "Update an announcement", description = "Updates an existing announcement with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Announcement updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class))),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @Parameter(description = "ID of the announcement to update", required = true) @PathVariable Long id,
            @Parameter(description = "Updated announcement details", required = true) @RequestBody AnnouncementDTO announcementDTO) {
        try {
            AnnouncementDTO updatedAnnouncement = announcementService.updateAnnouncement(id, announcementDTO);
            return ResponseEntity.ok(updatedAnnouncement);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Delete an announcement", description = "Deletes an announcement by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Announcement deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(
            @Parameter(description = "ID of the announcement to delete", required = true) @PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Like an announcement", description = "Increments the like count of an announcement")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Announcement liked successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnnouncementDTO.class))),
            @ApiResponse(responseCode = "404", description = "Announcement not found", content = @Content)
    })
    @PostMapping("/{id}/like")
    public ResponseEntity<AnnouncementDTO> likeAnnouncement(
            @Parameter(description = "ID of the announcement to like", required = true) @PathVariable Long id) {
        try {
            AnnouncementDTO announcement = announcementService.likeAnnouncement(id);
            return ResponseEntity.ok(announcement);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 