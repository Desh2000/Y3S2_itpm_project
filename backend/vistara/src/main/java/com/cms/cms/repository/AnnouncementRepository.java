package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cms.cms.model.Announcement;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Custom queries can be added here if needed
} 