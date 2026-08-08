package com.reggs.afrilumina.payment.mpesa;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reggs.afrilumina.payment.entity.PaymentStatus;
import com.reggs.afrilumina.payment.entity.PaymentTransaction;
import com.reggs.afrilumina.payment.repository.PaymentTransactionRepository; 
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/mpesa/callback")
@RequiredArgsConstructor
public class MpesaWebhookController {

    private final PaymentTransactionRepository transactionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    public ResponseEntity<String> handleCallback(@RequestBody String payload) {
        log.info("M-Pesa callback received: {}", payload);

        try {
            JsonNode root = objectMapper.readTree(payload);
            JsonNode body = root.path("Body");
            JsonNode stkCallback = body.path("stkCallback");

            String checkoutRequestId = stkCallback.path("CheckoutRequestID").asText();
            String resultCode = stkCallback.path("ResultCode").asText();
            String resultDesc = stkCallback.path("ResultDesc").asText();

            // Find the transaction by CheckoutRequestID (you need to store this in your entity)
            // For simplicity, we'll search by providerReference field
            PaymentTransaction transaction = transactionRepository.findByProviderReference(checkoutRequestId)
                    .orElseThrow(() -> new RuntimeException("Transaction not found for CheckoutRequestID: " + checkoutRequestId));

            if ("0".equals(resultCode)) {
                // Successful payment
                transaction.setStatus(PaymentStatus.PAID);
                // Extract MpesaReceiptNumber from CallbackMetadata if needed
                String receiptNumber = extractMetadataValue(stkCallback, "MpesaReceiptNumber");
                transaction.setProviderReference(receiptNumber); // or keep original
                log.info("M-Pesa payment completed for transaction {} (receipt {})", transaction.getId(), receiptNumber);
            } else {
                transaction.setStatus(PaymentStatus.FAILED);
                log.info("M-Pesa payment failed for transaction {}: {} {}", transaction.getId(), resultCode, resultDesc);
            }

            transactionRepository.save(transaction);

            return ResponseEntity.ok("{\"ResultCode\":0,\"ResultDesc\":\"Success\"}");
        } catch (IOException e) {
            log.error("Failed to parse M-Pesa callback payload", e);
            return ResponseEntity.status(400).body("Invalid payload");
        }
    }

    private String extractMetadataValue(JsonNode stkCallback, String key) {
        JsonNode metadata = stkCallback.path("CallbackMetadata").path("Item");
        for (JsonNode item : metadata) {
            if (item.path("Name").asText().equals(key)) {
                return item.path("Value").asText();
            }
        }
        return null;
    }
}