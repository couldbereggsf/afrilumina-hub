package com.reggs.afrilumina.payment;

import java.math.BigDecimal;

/**
 * Common contract so PaymentController doesn't need to know provider-specific details.
 * Each provider returns a checkout URL the frontend redirects to, and a provider reference
 * (Stripe Checkout Session id / PayPal Order id) we store to reconcile with webhooks later.
 */
public interface PaymentProvider {

    PaymentProviderType getType();

    CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose);

    record CheckoutResult(String checkoutUrl, String providerReference) {
    }
}
