package com.example.vistara.repository;


import com.example.vistara.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<com.example.vistara.model.Event, Long> {
}