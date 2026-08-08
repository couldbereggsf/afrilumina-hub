package com.reggs.afrilumina.payment;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.payment.entity.PaymentTransaction;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Initiates a payment (M-Pesa STK Push or PayPal).
     */
    @PostMapping("/create-checkout")
    public ResponseEntity<PaymentResponse> initiate(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.initiate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Polling endpoint for the frontend to check payment status.
     * Returns the current status of the transaction (PENDING, PAID, FAILED).
     */
    @GetMapping("/status/{transactionId}")
    public ResponseEntity<Map<String, String>> getPaymentStatus(@PathVariable Long transactionId) {
        PaymentTransaction transaction = paymentService.findById(transactionId);
        if (transaction == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("status", transaction.getStatus().name()));
    }

    // ----- Exception handlers -----

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