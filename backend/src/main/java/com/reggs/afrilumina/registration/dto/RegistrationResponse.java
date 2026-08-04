package com.reggs.afrilumina.registration.dto;

import com.reggs.afrilumina.registration.RegistrationCategory;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        String name,
        String email,
        String phone,
        String role,
        RegistrationCategory category,
        String details,
        String status,
        LocalDate date,
        LocalDateTime createdAt
) {
}