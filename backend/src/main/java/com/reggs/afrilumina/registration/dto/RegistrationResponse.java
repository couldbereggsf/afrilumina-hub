package com.reggs.afrilumina.registration.dto;

import com.reggs.afrilumina.registration.RegistrationCategory;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String country,
        RegistrationCategory category,
        String status,         
        String details,         
        LocalDate date,        
        LocalDateTime createdAt 
) {
}