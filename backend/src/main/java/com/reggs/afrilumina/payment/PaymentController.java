package com.reggs.afrilumina.payment;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Entry point for the frontend to kick off a payment (M-Pesa STK push or PayPal checkout).
 *
 * Error mapping:
 *  - IllegalArgumentException (bad registrationId, missing phoneNumber for M-Pesa,
 *    wrong currency, unregistered provider type) -> 400, message is safe to show the user
 *  - Anything else (provider HTTP failure, unexpected parsing error, etc.) -> 502 Bad Gateway,
 *    since the failure is on the upstream provider side, not the client's request. The real
 *    exception is logged server-side; the client only gets a generic message, since internal
 *    error details (stack traces, provider response bodies) shouldn't leak to the frontend.
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> initiate(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.initiate(request);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleProviderFailure(Exception e) {
        log.error("Payment initiation failed", e);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "Payment could not be initiated. Please try again shortly."));
    }
}