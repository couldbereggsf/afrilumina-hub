package com.reggs.afrilumina.payment;

import com.reggs.afrilumina.payment.dto.PaymentRequest;
import com.reggs.afrilumina.payment.dto.PaymentResponse;
import com.reggs.afrilumina.payment.entity.PaymentStatus;
import com.reggs.afrilumina.payment.entity.PaymentTransaction;
import com.reggs.afrilumina.payment.repository.PaymentTransactionRepository;
import com.reggs.afrilumina.registration.Registration;
import com.reggs.afrilumina.registration.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private PaymentProvider mpesaProvider;

    @Mock
    private PaymentProvider payPalProvider;

    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        when(mpesaProvider.getType()).thenReturn(PaymentProviderType.MPESA);
        when(payPalProvider.getType()).thenReturn(PaymentProviderType.PAYPAL);

        paymentService = new PaymentService(
                paymentTransactionRepository,
                registrationRepository,
                List.of(mpesaProvider, payPalProvider));
    }

    private PaymentTransaction transactionWithId(Long id, PaymentProviderType type) {
        PaymentTransaction txn = PaymentTransaction.builder()
                .provider(type.name())
                .amount(new BigDecimal("1500"))
                .currency("KES")
                .status(PaymentStatus.PENDING)
                .build();
        txn.setId(id);
        return txn;
    }

    @Test
    void initiate_mpesaWithoutPhoneNumber_throwsBeforeTouchingRepository() {
        PaymentRequest request = new PaymentRequest(1L, PaymentProviderType.MPESA,
                new BigDecimal("1500"), "KES", "Program fee", null);

        assertThrows(IllegalArgumentException.class, () -> paymentService.initiate(request));

        verifyNoInteractions(paymentTransactionRepository);
        verifyNoInteractions(registrationRepository);
    }

    @Test
    void initiate_mpesaHappyPath_savesTransactionThenRecordsProviderReference() {
        Registration registration = new Registration();
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(registration));

        PaymentTransaction saved = transactionWithId(100L, PaymentProviderType.MPESA);
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenReturn(saved);
        when(paymentTransactionRepository.findById(100L)).thenReturn(Optional.of(saved));

        when(mpesaProvider.createCheckout(eq(100L), any(BigDecimal.class), eq("KES"), eq("Program fee"), eq("0701546697")))
                .thenReturn(new PaymentProvider.CheckoutResult(null, "ws_CO_123"));

        PaymentRequest request = new PaymentRequest(1L, PaymentProviderType.MPESA,
                new BigDecimal("1500"), "KES", "Program fee", "0701546697");

        PaymentResponse response = paymentService.initiate(request);

        assertEquals(100L, response.transactionId());
        assertNull(response.checkoutUrl());
        assertEquals(PaymentStatus.PENDING.name(), response.status());

        verify(paymentTransactionRepository, times(2)).save(any(PaymentTransaction.class));
        assertEquals("ws_CO_123", saved.getProviderReference());
    }

    @Test
    void initiate_payPalHappyPath_returnsCheckoutUrl() {
        Registration registration = new Registration();
        when(registrationRepository.findById(2L)).thenReturn(Optional.of(registration));

        PaymentTransaction saved = transactionWithId(200L, PaymentProviderType.PAYPAL);
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenReturn(saved);
        when(paymentTransactionRepository.findById(200L)).thenReturn(Optional.of(saved));

        when(payPalProvider.createCheckout(eq(200L), any(BigDecimal.class), eq("USD"), eq("Donation"), isNull()))
                .thenReturn(new PaymentProvider.CheckoutResult("https://paypal.com/checkout/xyz", "ORDER123"));

        PaymentRequest request = new PaymentRequest(2L, PaymentProviderType.PAYPAL,
                new BigDecimal("25.00"), "USD", "Donation", null);

        PaymentResponse response = paymentService.initiate(request);

        assertEquals("https://paypal.com/checkout/xyz", response.checkoutUrl());
    }

    @Test
    void initiate_registrationNotFound_throwsAndNeverCreatesTransaction() {
        when(registrationRepository.findById(999L)).thenReturn(Optional.empty());

        PaymentRequest request = new PaymentRequest(999L, PaymentProviderType.PAYPAL,
                new BigDecimal("10"), "USD", "Donation", null);

        assertThrows(IllegalArgumentException.class, () -> paymentService.initiate(request));

        verify(paymentTransactionRepository, never()).save(any());
    }

    @Test
    void initiate_providerThrows_marksTransactionFailedAndRethrows() {
        Registration registration = new Registration();
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(registration));

        PaymentTransaction saved = transactionWithId(300L, PaymentProviderType.MPESA);
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenReturn(saved);
        when(paymentTransactionRepository.findById(300L)).thenReturn(Optional.of(saved));

        when(mpesaProvider.createCheckout(eq(300L), any(BigDecimal.class), eq("KES"), anyString(), eq("0701546697")))
                .thenThrow(new RuntimeException("Daraja timeout"));

        PaymentRequest request = new PaymentRequest(1L, PaymentProviderType.MPESA,
                new BigDecimal("1500"), "KES", "Program fee", "0701546697");

        assertThrows(RuntimeException.class, () -> paymentService.initiate(request));

        assertEquals(PaymentStatus.FAILED, saved.getStatus());
    }
}