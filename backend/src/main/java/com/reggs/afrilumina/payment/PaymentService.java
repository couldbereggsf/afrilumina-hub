package com.reggs.afrilumina.payment;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.registration.Registration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Orchestrates payment initiation across providers (M-Pesa, PayPal, ...).
 *
 * Transaction boundaries are intentionally split into three separate @Transactional
 * methods rather than one method wrapping the whole flow:
 *   1. create the PENDING row (short DB transaction)
 *   2. call the provider over HTTP (NO transaction — this is a network call, it
 *      must never hold a DB connection/lock open for its duration)
 *   3. record the result, or mark FAILED on error (short DB transaction)
 *
 * This means a slow or failing provider call never ties up a pooled DB connection,
 * and a failed call still leaves an auditable FAILED row instead of rolling back
 * the PENDING row as if the attempt never happened.
 */
@Slf4j
@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CrudRepository<Registration, Long> registrationRepository;
    private final Map<PaymentProviderType, PaymentProvider> providersByType;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            @Qualifier("registrationRepository") CrudRepository<Registration, Long> registrationRepository,
            List<PaymentProvider> providers) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.registrationRepository = registrationRepository;
        // Built from whatever PaymentProvider beans exist — adding a new provider later
        // (e.g. card payments) means implementing the interface and nothing else changes here.
        this.providersByType = providers.stream()
                .collect(Collectors.toMap(PaymentProvider::getType, Function.identity()));
    }

    public PaymentResponse initiate(PaymentRequest request) {
        if (request.provider() == PaymentProviderType.MPESA && !StringUtils.hasText(request.phoneNumber())) {
            throw new IllegalArgumentException("phoneNumber is required for M-Pesa payments");
        }

        PaymentProvider provider = providersByType.get(request.provider());
        if (provider == null) {
            throw new IllegalArgumentException("No provider registered for " + request.provider());
        }

        String currency = StringUtils.hasText(request.currency()) ? request.currency().toUpperCase() : defaultCurrencyFor(request.provider());

        PaymentTransaction transaction = createPendingTransaction(request, currency);

        try {
            PaymentProvider.CheckoutResult result = provider.createCheckout(
                    transaction.getId(), request.amount(), currency, request.purpose(), request.phoneNumber());

            recordSuccess(transaction.getId(), result.providerReference());

            return new PaymentResponse(
                    transaction.getId(), result.checkoutUrl(),
                    request.provider().name(), PaymentStatus.PENDING.name());

        } catch (Exception e) {
            log.error("Payment initiation failed for transaction {} via {}", transaction.getId(), request.provider(), e);
            recordFailure(transaction.getId());
            throw e;
        }
    }

    /**
     * M-Pesa only ever operates in KES; PayPal's fallback stays USD. Only used when
     * the client omits currency entirely — an explicit currency on the request always wins.
     */
    private String defaultCurrencyFor(PaymentProviderType providerType) {
        return providerType == PaymentProviderType.MPESA ? "KES" : "USD";
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected PaymentTransaction createPendingTransaction(PaymentRequest request, String currency) {
        Registration registration = registrationRepository.findById(request.registrationId())
                .orElseThrow(() -> new IllegalArgumentException("No registration found with id " + request.registrationId()));

        PaymentTransaction transaction = PaymentTransaction.builder()
                .registration(registration)
                .provider(request.provider())
                .amount(request.amount())
                .currency(currency)
                .purpose(request.purpose())
                .status(PaymentStatus.PENDING)
                .build();

        return paymentTransactionRepository.save(transaction);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void recordSuccess(Long transactionId, String providerReference) {
        paymentTransactionRepository.findById(transactionId).ifPresent(txn -> {
            txn.setProviderReference(providerReference);
            paymentTransactionRepository.save(txn);
        });
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void recordFailure(Long transactionId) {
        paymentTransactionRepository.findById(transactionId).ifPresent(txn -> {
            txn.setStatus(PaymentStatus.FAILED);
            paymentTransactionRepository.save(txn);
        });
    }
}