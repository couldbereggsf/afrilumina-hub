package com.reggs.afrilumina.registration.dto;

import com.reggs.afrilumina.registration.RegistrantCategory;
import com.reggs.afrilumina.registration.RegistrantStatus;

import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String country,
        RegistrantCategory category,
        RegistrantStatus status,
        LocalDateTime createdAt
) {
}
