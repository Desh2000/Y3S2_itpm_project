package com.example.vistara.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.OffsetDateTime; // Changed import

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private OffsetDateTime startDateTime; // Changed from LocalDateTime to OffsetDateTime
    private OffsetDateTime endDateTime;   // Changed from LocalDateTime to OffsetDateTime
    private String location;
    private String description;
    private String contactNumber;
    private String email;
    private boolean isApproved = false;
}