package com.reggs.afrilumina.payment.mpesa;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reggs.afrilumina.payment.PaymentStatus;
import com.reggs.afrilumina.payment.PaymentTransaction;
import com.reggs.afrilumina.payment.PaymentTransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Receives Safaricom's async STK Push callback.
 *
 * Daraja's actual callback shape (this is NOT a flat object — it's nested under
 * Body.stkCallback):
 *
 * {
 *   "Body": {
 *     "stkCallback": {
 *       "MerchantRequestID": "...",
 *       "CheckoutRequestID": "...",
 *       "ResultCode": 0,
 *       "ResultDesc": "The service request is processed successfully.",
 *       "CallbackMetadata": {
 *         "Item": [
 *           {"Name": "Amount", "Value": 1501},
 *           {"Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV"},
 *           {"Name": "TransactionDate", "Value": 20260804153000},
 *           {"Name": "PhoneNumber", "Value": 254712345678}
 *         ]
 *       }
 *     }
 *   }
 * }
 *
 * ResultCode == 0 means success. Anything else (1032 = cancelled by user,
 * 1037 = timeout, 1 = insufficient funds, etc.) is a failure — CallbackMetadata
 * is absent in that case, so it must never be assumed present.
 *
 * IMPORTANT: Safaricom expects a 200 response with {"ResultCode":0,"ResultDesc":"Accepted"}
 * regardless of whether the payment itself succeeded or failed — this response just
 * acknowledges receipt of the callback. Returning a non-200 or an error body makes
 * Safaricom retry the callback (up to a few times), which would otherwise cause
 * duplicate-processing bugs if not handled idempotently.
 */
@Slf4j
@RestController
@RequestMapping("/api/mpesa")
@RequiredArgsConstructor
public class PayPalWebhookController {

    private static final String ACK_BODY = "{\"ResultCode\":0,\"ResultDesc\":\"Accepted\"}";

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/callback")
    public ResponseEntity<String> handleMpesaCallback(@RequestBody String rawPayload) {
        log.info("M-Pesa callback received: {}", rawPayload);

        try {
            JsonNode callback = objectMapper.readTree(rawPayload)
                    .path("Body")
                    .path("stkCallback");

            if (callback.isMissingNode()) {
                log.error("M-Pesa callback missing Body.stkCallback: {}", rawPayload);
                return ResponseEntity.ok(ACK_BODY); // still ack — malformed payload isn't Safaricom's to retry forever
            }

            String checkoutRequestId = callback.path("CheckoutRequestID").asText(null);
            int resultCode = callback.path("ResultCode").asInt(-1);
            String resultDesc = callback.path("ResultDesc").asText("");

            if (checkoutRequestId == null) {
                log.error("M-Pesa callback missing CheckoutRequestID: {}", rawPayload);
                return ResponseEntity.ok(ACK_BODY);
            }

            String mpesaReceiptNumber = resultCode == 0 ? extractMetadataValue(callback, "MpesaReceiptNumber") : null;

            processCallback(checkoutRequestId, resultCode, resultDesc, mpesaReceiptNumber);

        } catch (Exception e) {
            // Never let a parsing/DB error propagate as a non-200 — that just makes
            // Safaricom retry a callback we may have already partially processed.
            // The failure is logged for manual follow-up instead.
            log.error("Failed to process M-Pesa callback: {}", rawPayload, e);
        }

        return ResponseEntity.ok(ACK_BODY);
    }

    @Transactional
    protected void processCallback(String checkoutRequestId, int resultCode, String resultDesc, String mpesaReceiptNumber) {
        PaymentTransaction transaction = paymentTransactionRepository.findByProviderReference(checkoutRequestId)
                .orElse(null);

        if (transaction == null) {
            log.warn("M-Pesa callback for unknown CheckoutRequestID: {}", checkoutRequestId);
            return;
        }

        if (transaction.getStatus() != PaymentStatus.PENDING) {
            // Safaricom can and does retry callbacks. Without this guard, a retry
            // could flip an already-COMPLETED transaction or double-process a side effect.
            log.info("Ignoring M-Pesa callback for transaction {} already in status {}",
                    transaction.getId(), transaction.getStatus());
            return;
        }

        if (resultCode == 0) {
            transaction.setStatus(PaymentStatus.COMPLETED);
            if (mpesaReceiptNumber != null) {
                transaction.setProviderReference(mpesaReceiptNumber); // supersede CheckoutRequestID with the actual receipt
            }
            log.info("M-Pesa payment completed for transaction {} (receipt {})", transaction.getId(), mpesaReceiptNumber);
        } else {
            transaction.setStatus(PaymentStatus.FAILED);
            log.info("M-Pesa payment failed for transaction {}: [{}] {}", transaction.getId(), resultCode, resultDesc);
        }

        paymentTransactionRepository.save(transaction);
    }

    /** CallbackMetadata.Item is a flat array of {Name, Value} pairs, not a map — this pulls one out by name. */
    private String extractMetadataValue(JsonNode stkCallback, String name) {
        for (JsonNode item : stkCallback.path("CallbackMetadata").path("Item")) {
            if (name.equals(item.path("Name").asText())) {
                JsonNode value = item.path("Value");
                return value.isMissingNode() ? null : value.asText();
            }
        }
        return null;
    }
}