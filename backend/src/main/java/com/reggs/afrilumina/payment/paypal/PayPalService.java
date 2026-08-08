package com.reggs.afrilumina.payment.paypal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reggs.afrilumina.payment.PaymentProvider;
import com.reggs.afrilumina.payment.PaymentProviderType;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
public class PayPalService implements PaymentProvider {

    @Value("${app.payments.paypal.client-id}")
    private String clientId;

    @Value("${app.payments.paypal.client-secret}")
    private String clientSecret;

    @Value("${app.payments.paypal.base-url}")
    private String baseUrl;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public PaymentProviderType getType() {
        return PaymentProviderType.PAYPAL;
    }

    @Override
    public CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose, String phoneNumber) {
        try {
            String accessToken = getAccessToken(); // Authenticate with PayPal
            String jsonPayload = buildOrderPayload(amount, currency, purpose);

            RequestBody body = RequestBody.create(jsonPayload, MediaType.parse("application/json"));
            Request request = new Request.Builder()
                    .url(baseUrl + "/v2/checkout/orders")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String rawBody = response.body() != null ? response.body().string() : "";
                    log.error("PayPal order creation failed: status={}, body={}", response.code(), rawBody);
                    throw new RuntimeException("PayPal order creation failed");
                }

                JsonNode json = objectMapper.readTree(response.body().string());
                String id = json.path("id").asText();
                String approvalUrl = null;

                // Find the "approve" link in the response
                JsonNode links = json.path("links");
                for (JsonNode link : links) {
                    if ("approve".equals(link.path("rel").asText())) {
                        approvalUrl = link.path("href").asText();
                        break;
                    }
                }
                return new CheckoutResult(approvalUrl, id);
            }
        } catch (IOException e) {
            log.error("PayPal integration error", e);
            throw new RuntimeException("Failed to initiate PayPal checkout", e);
        }
    }

    private String getAccessToken() throws IOException {
        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        Request request = new Request.Builder()
                .url(baseUrl + "/v1/oauth2/token")
                .header("Authorization", "Basic " + encodedAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .post(RequestBody.create("grant_type=client_credentials", MediaType.parse("application/x-www-form-urlencoded")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Failed to get PayPal token");
            JsonNode json = objectMapper.readTree(response.body().string());
            return json.path("access_token").asText();
        }
    }

    private String buildOrderPayload(BigDecimal amount, String currency, String description) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("intent", "CAPTURE");

        Map<String, Object> purchaseUnit = new LinkedHashMap<>();
        purchaseUnit.put("description", description);
        Map<String, Object> amountMap = new LinkedHashMap<>();
        amountMap.put("currency_code", currency != null ? currency : "USD");
        amountMap.put("value", amount.toString());
        purchaseUnit.put("amount", amountMap);
        payload.put("purchase_units", new Object[]{purchaseUnit});

        Map<String, Object> appContext = new LinkedHashMap<>();
        appContext.put("return_url", "http://localhost:5173/payment-success");
        appContext.put("cancel_url", "http://localhost:5173/payment-cancelled");
        payload.put("application_context", appContext);

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (IOException e) {
            throw new RuntimeException("Failed to build PayPal payload", e);
        }
    }
}