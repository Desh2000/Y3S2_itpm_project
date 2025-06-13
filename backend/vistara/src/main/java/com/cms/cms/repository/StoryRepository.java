package com.cms.cms.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cms.cms.model.Story;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    // Find all active stories (not expired)
    List<Story> findByActiveAndExpiresAtGreaterThanOrderByCreatedAtDesc(boolean active, LocalDateTime currentTime);
    
    // Find all stories by author
    List<Story> findByAuthorNameOrderByCreatedAtDesc(String authorName);
    
    // Find active stories created by a specific author
    List<Story> findByAuthorNameAndActiveAndExpiresAtGreaterThanOrderByCreatedAtDesc(
        String authorName, boolean active, LocalDateTime currentTime);
        
    // Custom query to find stories that are about to expire in the next hour
    @Query("SELECT s FROM Story s WHERE s.active = true AND s.expiresAt BETWEEN ?1 AND ?2")
    List<Story> findStoriesAboutToExpire(LocalDateTime start, LocalDateTime end);
} 