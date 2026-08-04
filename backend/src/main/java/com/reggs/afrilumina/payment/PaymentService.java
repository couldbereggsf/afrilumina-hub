package com.reggs.afrilumina.payment;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.payment.paypal.PayPalService;
import com.reggs.afrilumina.payment.stripe.StripeService;
import com.reggs.afrilumina.registration.Registration;

@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CrudRepository<Registration, Long> registrationRepository;
    private final StripeService stripeService;
    private final PayPalService payPalService;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            @Qualifier("registrationRepository") CrudRepository<Registration, Long> registrationRepository,
            StripeService stripeService,
            PayPalService payPalService) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.registrationRepository = registrationRepository;
        this.stripeService = stripeService;
        this.payPalService = payPalService;
    }

    @Transactional
    public PaymentResponse initiate(PaymentRequest request) {
        Registration registration = registrationRepository.findById(request.registrationId())
                .orElseThrow(() -> new IllegalArgumentException("No registration found with id " + request.registrationId()));

        String currency = StringUtils.hasText(request.currency()) ? request.currency().toUpperCase() : "USD";

        PaymentTransaction transaction = PaymentTransaction.builder()
                .registration(registration)
                .provider(request.provider())
                .amount(request.amount())
                .currency(currency)
                .purpose(request.purpose())
                .status(PaymentStatus.PENDING)
                .build();

        transaction = paymentTransactionRepository.save(transaction);

        PaymentProvider provider = switch (request.provider()) {
            case STRIPE -> stripeService;
            case PAYPAL -> payPalService;
        };

        PaymentProvider.CheckoutResult result = provider.createCheckout(
                transaction.getId(), request.amount(), currency, request.purpose());

        transaction.setProviderReference(result.providerReference());
        paymentTransactionRepository.save(transaction);

        return new PaymentResponse(
                transaction.getId(), result.checkoutUrl(),
                request.provider().name(), transaction.getStatus().name());
    }
}
