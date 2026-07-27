package com.reggs.afrilumina.payment.dto;

public record PaymentResponse(
        Long transactionId,
        String checkoutUrl,      // where the frontend should redirect the user to complete payment
        String provider,
        String status
) {
}
