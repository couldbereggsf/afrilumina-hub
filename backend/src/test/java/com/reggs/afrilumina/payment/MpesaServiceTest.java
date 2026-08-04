package com.reggs.afrilumina.payment;

import com.reggs.afrilumina.payment.PaymentProvider;
import com.reggs.afrilumina.payment.PaymentProviderType;
import com.reggs.afrilumina.payment.mpesa.MpesaService;
import com.reggs.afrilumina.payment.mpesa.MpesaService.MpesaException;
import com.reggs.afrilumina.payment.mpesa.MpesaService.StkPushResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for MpesaService.createCheckout and the phone normalization it relies on.
 *
 * stkPush is stubbed via a spy rather than actually invoked - these tests verify
 * MpesaService's own business logic (currency validation, rounding, dispatch to
 * stkPush with the right arguments), not the real Daraja HTTP call, which belongs
 * in a separate sandbox integration test instead.
 */
@ExtendWith(MockitoExtension.class)
class MpesaServiceTest {

    private MpesaService mpesaService;

    @BeforeEach
    void setUp() {
        mpesaService = spy(new MpesaService());
    }

    @Test
    void getType_returnsMpesa() {
        assertEquals(PaymentProviderType.MPESA, mpesaService.getType());
    }

    @Test
    void createCheckout_rejectsNonKesCurrency() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                mpesaService.createCheckout(1L, new BigDecimal("500"), "USD", "Program fee", "0712345678"));

        assertTrue(ex.getMessage().contains("KES"));
    }

    @Test
    void createCheckout_rejectsBlankPhoneNumber() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                mpesaService.createCheckout(1L, new BigDecimal("500"), "KES", "Program fee", "  "));

        assertTrue(ex.getMessage().toLowerCase().contains("phone"));
    }

    @Test
    void createCheckout_roundsWholeAmountAndDelegatesToStkPush() throws IOException {
        MpesaService.StkPushResponse stubResponse = new MpesaService.StkPushResponse();
        stubResponse.CheckoutRequestID = "ws_CO_123456";

        doReturn(stubResponse).when(mpesaService)
                .stkPush(eq("0712345678"), eq(1501L), eq("TXN-42"), eq("Program fee"));

        PaymentProvider.CheckoutResult result = mpesaService.createCheckout(
                42L, new BigDecimal("1500.50"), "KES", "Program fee", "0712345678");

        // 1500.50 rounds HALF_UP to 1501 - verified via the stub matcher above actually
        // being invoked (Mockito would fail the test with an unmatched-stub error otherwise).
        assertNull(result.checkoutUrl());
        assertEquals("ws_CO_123456", result.providerReference());
    }

    @Test
    void createCheckout_wholeNumberAmountIsUnchanged() throws IOException {
        MpesaService.StkPushResponse stubResponse = new MpesaService.StkPushResponse();
        stubResponse.CheckoutRequestID = "ws_CO_999";

        doReturn(stubResponse).when(mpesaService)
                .stkPush(anyString(), eq(2000L), anyString(), anyString());

        PaymentProvider.CheckoutResult result = mpesaService.createCheckout(
                7L, new BigDecimal("2000"), "KES", "Donation", "0700000000");

        assertEquals("ws_CO_999", result.providerReference());
    }

    @Test
    void createCheckout_wrapsIOExceptionFromStkPushAsMpesaException() throws IOException {
        doThrow(new IOException("network timeout")).when(mpesaService)
                .stkPush(anyString(), anyLong(), anyString(), anyString());

        assertThrows(MpesaService.MpesaException.class, () ->
                mpesaService.createCheckout(1L, new BigDecimal("100"), "KES", "Donation", "0712345678"));
    }

    // --- phone normalization (private method, tested via reflection) ---

    @Test
    void normalizePhoneNumber_handlesLeadingZeroFormat() {
        String result = ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "0712345678");
        assertEquals("254712345678", result);
    }

    @Test
    void normalizePhoneNumber_handlesPlusPrefixedFormat() {
        String result = ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "+254712345678");
        assertEquals("254712345678", result);
    }

    @Test
    void normalizePhoneNumber_handlesAlreadyNormalizedFormat() {
        String result = ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "254712345678");
        assertEquals("254712345678", result);
    }

    @Test
    void normalizePhoneNumber_handlesBareNineDigitFormat() {
        String result = ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "712345678");
        assertEquals("254712345678", result);
    }

    @Test
    void normalizePhoneNumber_handlesSafaricomLinePrefix() {
        // Safaricom also issues numbers starting with 1 (e.g. 01XXXXXXXX / 254 1XXXXXXXX)
        String result = ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "0112345678");
        assertEquals("254112345678", result);
    }

    @Test
    void normalizePhoneNumber_rejectsInvalidNumber() {
        assertThrows(IllegalArgumentException.class, () ->
                ReflectionTestUtils.invokeMethod(mpesaService, "normalizePhoneNumber", "12345"));
    }
}