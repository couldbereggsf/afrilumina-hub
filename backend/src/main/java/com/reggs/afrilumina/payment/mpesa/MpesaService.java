package com.reggs.afrilumina.payment.mpesa;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reggs.afrilumina.payment.PaymentProvider;
import com.reggs.afrilumina.payment.PaymentProviderType;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Service for interacting with the Safaricom Daraja API (M-Pesa STK Push / C2B).
 *
 * Notes:
 *  - Access tokens are cached in memory and refreshed only once they're close to expiry,
 *    to avoid hammering the OAuth endpoint on every transaction.
 *  - This class is thread-safe for concurrent STK push calls (token refresh is guarded by a lock).
 *  - Callback URL, environment (sandbox/prod) and all secrets are externalized to config —
 *    nothing is hardcoded.
 */
@Slf4j
@Service
public class MpesaService implements PaymentProvider {

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(ZoneId.of("Africa/Nairobi"));

    // Refresh the token a bit before it actually expires, to avoid a race
    // where a request starts using a token that expires mid-flight.
    private static final long TOKEN_REFRESH_BUFFER_SECONDS = 60;

    @Value("${mpesa.consumer-key}")
    private String consumerKey;

    @Value("${mpesa.consumer-secret}")
    private String consumerSecret;

    @Value("${mpesa.passkey}")
    private String passkey;

    @Value("${mpesa.short-code}")
    private String shortCode;

    @Value("${mpesa.api-url}")
    private String apiUrl;

    @Value("${mpesa.callback-url}")
    private String callbackUrl;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ReentrantLock tokenLock = new ReentrantLock();

    private volatile String cachedToken;
    private volatile Instant tokenExpiresAt = Instant.EPOCH;

    /**
     * Returns a valid access token, reusing the cached one if it hasn't expired yet.
     */
    public String getAccessToken() throws IOException {
        if (cachedToken != null && Instant.now().isBefore(tokenExpiresAt)) {
            return cachedToken;
        }

        tokenLock.lock();
        try {
            // Re-check after acquiring the lock in case another thread already refreshed it.
            if (cachedToken != null && Instant.now().isBefore(tokenExpiresAt)) {
                return cachedToken;
            }
            return fetchNewAccessToken();
        } finally {
            tokenLock.unlock();
        }
    }

    private String fetchNewAccessToken() throws IOException {
        String auth = consumerKey + ":" + consumerSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        Request request = new Request.Builder()
                .url(apiUrl + "/oauth/v1/generate?grant_type=client_credentials")
                .header("Authorization", "Basic " + encodedAuth)
                .build();

        try (Response response = client.newCall(request).execute()) {
            ResponseBody body = response.body();
            String rawBody = body != null ? body.string() : "";

            if (!response.isSuccessful()) {
                log.error("M-Pesa OAuth request failed: status={}, body={}", response.code(), rawBody);
                throw new MpesaException("Failed to obtain M-Pesa access token (HTTP " + response.code() + ")");
            }

            JsonNode json = objectMapper.readTree(rawBody);
            String token = json.path("access_token").asText(null);
            long expiresIn = json.path("expires_in").asLong(3599);

            if (token == null) {
                log.error("M-Pesa OAuth response missing access_token: {}", rawBody);
                throw new MpesaException("M-Pesa OAuth response did not contain an access token");
            }

            cachedToken = token;
            tokenExpiresAt = Instant.now().plusSeconds(Math.max(0, expiresIn - TOKEN_REFRESH_BUFFER_SECONDS));
            return cachedToken;
        }
    }

    @Override
    public PaymentProviderType getType() {
        return PaymentProviderType.MPESA;
    }

    /**
     * PaymentProvider entry point. Delegates to stkPush after:
     *  - validating currency is KES (M-Pesa cannot process anything else)
     *  - rounding amount to the nearest whole KES, logging a warning if that
     *    changed the value (e.g. a registration fee of 1500.50 becomes 1501,
     *    and that discrepancy should be visible in logs, not silent)
     *
     * checkoutUrl in the returned CheckoutResult is always null: STK push has
     * no redirect, the prompt goes straight to the customer's phone.
     */
    @Override
    public CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose, String phoneNumber) {
        if (!StringUtils.hasText(currency) || !currency.equalsIgnoreCase("KES")) {
            throw new IllegalArgumentException("M-Pesa only supports KES, got: " + currency);
        }
        if (!StringUtils.hasText(phoneNumber)) {
            throw new IllegalArgumentException("phoneNumber is required for M-Pesa payments");
        }

        BigDecimal rounded = amount.setScale(0, RoundingMode.HALF_UP);
        if (rounded.compareTo(amount) != 0) {
            log.warn("M-Pesa amount rounded for transaction {}: requested={} KES, charging={} KES",
                    transactionId, amount, rounded);
        }

        try {
            StkPushResponse response = stkPush(
                    phoneNumber,
                    rounded.longValueExact(),
                    "TXN-" + transactionId,
                    purpose);

            return new CheckoutResult(null, response.CheckoutRequestID);
        } catch (IOException e) {
            log.error("M-Pesa STK push failed for transaction {}", transactionId, e);
            throw new MpesaException("Failed to initiate M-Pesa STK push: " + e.getMessage());
        }
    }

    /**
     * Initiates an STK Push (Lipa na M-Pesa Online) request.
     *
     * @param phoneNumber       customer phone number, any common Kenyan format
     *                          (07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX)
     * @param amount            amount in whole KES (M-Pesa does not support decimals)
     * @param accountReference  short reference shown to the customer (max ~12 chars recommended)
     * @param transactionDesc   short description shown to the customer
     * @return parsed response containing MerchantRequestID / CheckoutRequestID / ResponseCode
     */
    public StkPushResponse stkPush(String phoneNumber, long amount, String accountReference, String transactionDesc)
            throws IOException {

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be a positive whole number");
        }

        String normalizedPhone = normalizePhoneNumber(phoneNumber);
        String token = getAccessToken();
        String timestamp = TIMESTAMP_FORMAT.format(Instant.now());
        String password = Base64.getEncoder().encodeToString(
                (shortCode + passkey + timestamp).getBytes(StandardCharsets.UTF_8));

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("BusinessShortCode", shortCode);
        payload.put("Password", password);
        payload.put("Timestamp", timestamp);
        payload.put("TransactionType", "CustomerPayBillOnline");
        payload.put("Amount", amount);
        payload.put("PartyA", normalizedPhone);
        payload.put("PartyB", shortCode);
        payload.put("PhoneNumber", normalizedPhone);
        payload.put("CallBackURL", callbackUrl);
        payload.put("AccountReference", truncate(accountReference, 12));
        payload.put("TransactionDesc", truncate(transactionDesc, 13));

        String jsonBody = objectMapper.writeValueAsString(payload);

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(apiUrl + "/mpesa/stkpush/v1/processrequest")
                .header("Authorization", "Bearer " + token)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            ResponseBody responseBody = response.body();
            String rawBody = responseBody != null ? responseBody.string() : "";

            if (!response.isSuccessful()) {
                log.error("STK push failed: status={}, body={}", response.code(), rawBody);
                throw new MpesaException("STK push request failed (HTTP " + response.code() + "): " + rawBody);
            }

            log.info("STK push initiated for {} -> {}", normalizedPhone, rawBody);
            return objectMapper.readValue(rawBody, StkPushResponse.class);
        }
    }

    /**
     * Normalizes common Kenyan phone number formats to Daraja's required 2547XXXXXXXX / 2541XXXXXXXX format.
     */
    private String normalizePhoneNumber(String phone) {
        if (phone == null) {
            throw new IllegalArgumentException("Phone number must not be null");
        }
        String cleaned = phone.trim().replaceAll("[\\s\\-()]", "");

        if (cleaned.startsWith("+")) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.startsWith("0") && cleaned.length() == 10) {
            cleaned = "254" + cleaned.substring(1);
        }
        if (cleaned.startsWith("7") && cleaned.length() == 9) {
            cleaned = "254" + cleaned;
        }
        if (cleaned.startsWith("1") && cleaned.length() == 9) {
            cleaned = "254" + cleaned;
        }

        if (!cleaned.matches("^254(7|1)\\d{8}$")) {
            throw new IllegalArgumentException("Invalid Kenyan phone number: " + phone);
        }
        return cleaned;
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return "";
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }

    /**
     * Parsed response from the STK Push endpoint.
     * Field names match Daraja's response payload exactly (Jackson maps by name).
     */
    public static class StkPushResponse {
        public String MerchantRequestID;
        public String CheckoutRequestID;
        public String ResponseCode;
        public String ResponseDescription;
        public String CustomerMessage;
    }

    /**
     * Thrown when Daraja returns an error or an unexpected response shape.
     */
    public static class MpesaException extends RuntimeException {
        public MpesaException(String message) {
            super(message);
        }
    }
}