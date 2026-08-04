package com.reggs.afrilumina.registration.dto;

import com.reggs.afrilumina.registration.RegistrationCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Incoming registration submission.
 *
 * country and message aren't columns on the Registration entity - they get folded
 * into the details JSON blob by RegistrationService.register(), the same way
 * seedDefaultData() hand-builds country/status info into that field. role isn't
 * part of the request either - it's derived from category (STUDENT -> "student",
 * MENTOR -> "mentor"), matching the existing seed data pattern.
 */
public record RegistrationRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        String country,
        @NotNull RegistrationCategory category,
        String message
) {
}