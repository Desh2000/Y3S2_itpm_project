package com.cms.cms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.cms.cms.repository")
@EnableTransactionManagement
public class JpaConfig {
    // Configuration for JPA and Hibernate 
    // Additional configuration can be added as needed
} 