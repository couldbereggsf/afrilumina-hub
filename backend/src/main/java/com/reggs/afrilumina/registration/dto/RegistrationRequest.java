package com.reggs.afrilumina.registration.dto;

import com.reggs.afrilumina.registration.RegistrationCategory;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 255)
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String phone,

        String country,

        @NotNull(message = "Category is required")
        RegistrationCategory category,

        @Size(max = 2000, message = "Message must be under 2000 characters")
        String message
) {

    public String getFullName() {
        return fullName;
    }
}
