package com.reggs.afrilumina.payment.stripe;

import com.reggs.afrilumina.payment.PaymentProvider;
import com.reggs.afrilumina.payment.PaymentProviderType;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class StripeService implements PaymentProvider {

    @Value("${app.payments.stripe.success-url}")
    private String successUrl;

    @Value("${app.payments.stripe.cancel-url}")
    private String cancelUrl;

    @Value("${app.payments.stripe.webhook-secret}")
    private String webhookSecret;

    @Override
    public PaymentProviderType getType() {
        return PaymentProviderType.STRIPE;
    }

    @Override
    public CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose) {
        try {
            long amountInSmallestUnit = amount.multiply(BigDecimal.valueOf(100)).longValueExact(); // e.g. cents

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?txn=" + transactionId)
                    .setCancelUrl(cancelUrl + "?txn=" + transactionId)
                    .putMetadata("transactionId", String.valueOf(transactionId))
                    .putMetadata("purpose", purpose == null ? "DONATION" : purpose)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency(currency.toLowerCase())
                                                    .setUnitAmount(amountInSmallestUnit)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(purpose == null ? "AfriLumina Hub Payment" : purpose)
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            return new CheckoutResult(session.getUrl(), session.getId());

        } catch (StripeException e) {
            log.error("Stripe checkout session creation failed: {}", e.getMessage());
            throw new RuntimeException("Unable to create Stripe checkout session", e);
        }
    }

    /**
     * Verifies the webhook came from Stripe using the signing secret (whsec_...).
     * Throws if the signature is invalid - callers must reject the request in that case.
     */
    public com.stripe.model.Event verifyAndParseWebhook(String payload, String sigHeader) {
        try {
            return Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Invalid Stripe webhook signature", e);
        }
    }
}
