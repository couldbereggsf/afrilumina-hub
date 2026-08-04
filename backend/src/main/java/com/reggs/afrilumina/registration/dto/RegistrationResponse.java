package com.reggs.afrilumina.registration.dto;

import java.time.LocalDateTime;

import com.reggs.afrilumina.registration.RegistrationCategory;

public record RegistrationResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String country,
        RegistrationCategory category,
        String status,
        LocalDateTime createdAt
) {
}