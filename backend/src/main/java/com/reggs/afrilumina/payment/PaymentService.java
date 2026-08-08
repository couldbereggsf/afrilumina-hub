package com.reggs.afrilumina.payment;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.payment.entity.PaymentStatus;
import com.reggs.afrilumina.payment.entity.PaymentTransaction;
import com.reggs.afrilumina.payment.repository.PaymentTransactionRepository;
import com.reggs.afrilumina.registration.Registration;
import com.reggs.afrilumina.registration.RegistrationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final RegistrationRepository registrationRepository;
    private final Map<PaymentProviderType, PaymentProvider> providersByType;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            RegistrationRepository registrationRepository,
            List<PaymentProvider> providers) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.registrationRepository = registrationRepository;
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

        String currency = StringUtils.hasText(request.currency())
                ? request.currency().toUpperCase()
                : defaultCurrencyFor(request.provider());

        PaymentTransaction transaction = createPendingTransaction(request, currency);

        try {
            PaymentProvider.CheckoutResult result = provider.createCheckout(
                    transaction.getId(),
                    request.amount(),
                    currency,
                    request.purpose(),
                    request.phoneNumber());

            recordProviderReference(transaction.getId(), result.providerReference());

            return new PaymentResponse(
                    transaction.getId(),
                    result.checkoutUrl(),
                    request.provider().name(),
                    PaymentStatus.PENDING.name());

        } catch (Exception e) {
            log.error("Payment initiation failed for transaction {} via {}",
                    transaction.getId(), request.provider(), e);
            recordFailure(transaction.getId());
            throw e;
        }
    }

    public PaymentTransaction findById(Long transactionId) {
        return paymentTransactionRepository.findById(transactionId).orElse(null);
    }

    private String defaultCurrencyFor(PaymentProviderType providerType) {
        return providerType == PaymentProviderType.MPESA ? "KES" : "USD";
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected PaymentTransaction createPendingTransaction(PaymentRequest request, String currency) {
        Registration registration = registrationRepository.findById(request.registrationId())
                .orElseThrow(() -> new IllegalArgumentException("No registration found with id " + request.registrationId()));

        PaymentTransaction transaction = PaymentTransaction.builder()
                .registration(registration)
                .provider(request.provider().name())
                .amount(request.amount())
                .currency(currency)
                .purpose(request.purpose())
                .status(PaymentStatus.PENDING)
                .build();

        return paymentTransactionRepository.save(transaction);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void recordProviderReference(Long transactionId, String providerReference) {
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