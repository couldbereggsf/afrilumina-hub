package com.reggs.afrilumina.payment;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.payment.paypal.PayPalService;
import com.reggs.afrilumina.payment.stripe.StripeService;
import com.reggs.afrilumina.registration.Registrant;
import com.reggs.afrilumina.registration.RegistrantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final RegistrantRepository registrantRepository;
    private final StripeService stripeService;
    private final PayPalService payPalService;

    @Transactional
    public PaymentResponse initiate(PaymentRequest request) {
        Registrant registrant = registrantRepository.findById(request.registrantId())
                .orElseThrow(() -> new IllegalArgumentException("No registrant found with id " + request.registrantId()));

        String currency = StringUtils.hasText(request.currency()) ? request.currency().toUpperCase() : "USD";

        PaymentTransaction transaction = PaymentTransaction.builder()
                .registrant(registrant)
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
