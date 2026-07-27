package com.reggs.afrilumina.payment.paypal;

import com.reggs.afrilumina.payment.PaymentStatus;
import com.reggs.afrilumina.payment.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments/paypal")
@RequiredArgsConstructor
@Slf4j
public class PayPalWebhookController {

    private final PayPalService payPalService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    /**
     * Frontend redirects the buyer here (or calls it) after they approve payment on PayPal's
     * site, passing the PayPal order id (token query param PayPal appends on redirect).
     * We then capture the order to actually move the funds.
     */
    @GetMapping("/capture")
    public ResponseEntity<Map<String, String>> capture(@RequestParam("token") String orderId) {
        boolean success = payPalService.captureOrder(orderId);

        paymentTransactionRepository.findByProviderReference(orderId).ifPresentOrElse(
                txn -> {
                    txn.setStatus(success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
                    paymentTransactionRepository.save(txn);
                    log.info("PayPal capture for order {} -> {}", orderId, txn.getStatus());
                },
                () -> log.warn("PayPal capture: no matching transaction for order {}", orderId)
        );

        return ResponseEntity.ok(Map.of("status", success ? "COMPLETED" : "FAILED"));
    }

    /**
     * Optional: PayPal can also be configured (in the developer dashboard) to POST webhook
     * events here (e.g. PAYMENT.CAPTURE.COMPLETED) as a more reliable alternative/backup to
     * the redirect-based capture above. Left as a stub for when that's wired up.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@org.springframework.web.bind.annotation.RequestBody String payload) {
        log.info("Received PayPal webhook event (verification not yet implemented): {}", payload);
        return ResponseEntity.ok("received");
    }
}
