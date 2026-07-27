package com.reggs.afrilumina.payment.stripe;

import com.reggs.afrilumina.payment.PaymentStatus;
import com.reggs.afrilumina.payment.PaymentTransaction;
import com.reggs.afrilumina.payment.PaymentTransactionRepository;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/stripe")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final StripeService stripeService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@org.springframework.web.bind.annotation.RequestBody String payload,
                                                 @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event = stripeService.verifyAndParseWebhook(payload, sigHeader);

        if ("checkout.session.completed".equals(event.getType())) {
            event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                Session session = (Session) obj;
                paymentTransactionRepository.findByProviderReference(session.getId())
                        .ifPresentOrElse(
                                txn -> {
                                    txn.setStatus(PaymentStatus.COMPLETED);
                                    paymentTransactionRepository.save(txn);
                                    log.info("Stripe payment completed for transaction {}", txn.getId());
                                },
                                () -> log.warn("Stripe webhook: no matching transaction for session {}", session.getId())
                        );
            });
        }

        return ResponseEntity.ok("received");
    }
}
