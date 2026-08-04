package com.reggs.afrilumina.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.reggs.afrilumina.payment.PaymentProviderType;

/**
 * Incoming payment request.
 *
 * phoneNumber is required when provider == MPESA (STK push target) and ignored for PAYPAL.
 * Validated in PaymentService rather than here, since the "required" rule depends on
 * the provider field — a single @NotNull on phoneNumber would wrongly reject PayPal requests.
 */
public record PaymentRequest(
        @NotNull Long registrationId,
        @NotNull PaymentProviderType provider,
        @NotNull @Positive java.math.BigDecimal amount,
        String currency,
        @NotNull String purpose,
        String phoneNumber
) {
}