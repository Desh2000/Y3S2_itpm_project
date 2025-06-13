package com.cms.cms.service;

import java.util.List;

import com.cms.cms.dto.AnnouncementDTO;
import com.cms.cms.model.Announcement;

public interface AnnouncementService {
    List<AnnouncementDTO> getAllAnnouncements();
    AnnouncementDTO getAnnouncementById(Long id);
    AnnouncementDTO createAnnouncement(AnnouncementDTO announcementDTO);
    AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO announcementDTO);
    void deleteAnnouncement(Long id);
    AnnouncementDTO likeAnnouncement(Long id);
} 