package com.reggs.afrilumina.payment.dto;

import com.reggs.afrilumina.payment.PaymentProviderType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequest(

        @NotNull(message = "registrationId is required")
        Long registrationId,

        @NotNull(message = "provider is required")
        PaymentProviderType provider,

        @NotNull(message = "amount is required")
        @DecimalMin(value = "1.00", message = "amount must be at least 1.00")
        BigDecimal amount,

        String currency,   // defaults to USD if blank

        String purpose     // e.g. DONATION, PROGRAM_FEE
) {
}
