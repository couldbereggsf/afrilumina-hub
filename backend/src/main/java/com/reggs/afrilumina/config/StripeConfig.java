package com.reggs.afrilumina.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeConfig {

    @Value("${app.payments.stripe.secret-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        // In sandbox mode this is a Stripe TEST secret key (sk_test_...).
        // Swap to a live key (sk_live_...) via the STRIPE_SECRET_KEY env var when ready - no code change needed.
        Stripe.apiKey = stripeSecretKey;
    }
}
