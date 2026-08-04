package com.reggs.afrilumina.payment;

import java.math.BigDecimal;

/**
 * Common contract for payment providers (M-Pesa, PayPal, ...).
 *
 * phoneNumber is only meaningful for providers that push a prompt to a device (M-Pesa STK).
 * PayPal (and any future redirect-based provider) ignores it. It's part of the shared
 * signature rather than a separate method so PaymentService can dispatch through one
 * interface without knowing which providers need what.
 *
 * checkoutUrl in CheckoutResult is nullable: M-Pesa has no redirect URL — the customer
 * confirms on their phone, not in the browser. Callers (controller/frontend) must treat
 * a null checkoutUrl as "no redirect, show a 'check your phone' state" rather than an error.
 */
public interface PaymentProvider {

    PaymentProviderType getType();

    CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose, String phoneNumber);

    record CheckoutResult(String checkoutUrl, String providerReference) {}
}