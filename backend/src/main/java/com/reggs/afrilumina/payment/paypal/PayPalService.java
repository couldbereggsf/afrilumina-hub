package com.reggs.afrilumina.payment.paypal;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import com.reggs.afrilumina.payment.PaymentProvider;
import com.reggs.afrilumina.payment.PaymentProviderType;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PayPalService implements PaymentProvider {

    @Value("${app.payments.paypal.client-id}")
    private String clientId;

    @Value("${app.payments.paypal.client-secret}")
    private String clientSecret;

    @Value("${app.payments.paypal.base-url}")
    private String baseUrl;   // sandbox by default: https://api-m.sandbox.paypal.com - swap to live URL when ready

    private WebClient webClient() {
        return WebClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public PaymentProviderType getType() {
        return PaymentProviderType.PAYPAL;
    }

    private String getAccessToken() {
        String credentials = Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes());

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");

        Map<String, Object> response = webClient().post()
                .uri("/v1/oauth2/token")
                .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(org.springframework.web.reactive.function.BodyInserters.fromFormData(form))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response == null ? null : (String) response.get("access_token");
    }

    /**
     * phoneNumber is unused here — PayPal's checkout is a browser redirect, not a
     * device push. It's accepted (and ignored) purely to satisfy the shared
     * PaymentProvider interface that MpesaService also implements.
     */
    @Override
    public CheckoutResult createCheckout(Long transactionId, BigDecimal amount, String currency, String purpose, String phoneNumber) {
        String accessToken = getAccessToken();

        Map<String, Object> orderRequest = Map.of(
                "intent", "CAPTURE",
                "purchase_units", List.of(Map.of(
                        "reference_id", String.valueOf(transactionId),
                        "description", purpose == null ? "AfriLumina Hub Payment" : purpose,
                        "amount", Map.of(
                                "currency_code", currency,
                                "value", amount.setScale(2).toString()
                        )
                )),
                "application_context", Map.of(
                        "brand_name", "AfriLumina Hub",
                        "user_action", "PAY_NOW"
                )
        );

        Map<String, Object> response = webClient().post()
                .uri("/v2/checkout/orders")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(orderRequest)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new RuntimeException("PayPal order creation returned no response");
        }

        String orderId = (String) response.get("id");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> links = (List<Map<String, Object>>) response.get("links");
        String approveUrl = links.stream()
                .filter(link -> "approve".equals(link.get("rel")))
                .map(link -> (String) link.get("href"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No approve link returned by PayPal"));

        return new CheckoutResult(approveUrl, orderId);
    }

    /** Called after the buyer approves the order on PayPal's site, to finalize the charge. */
    public boolean captureOrder(String orderId) {
        String accessToken = getAccessToken();

        Map<String, Object> response = webClient().post()
                .uri("/v2/checkout/orders/{id}/capture", orderId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response != null && "COMPLETED".equals(response.get("status"));
    }
}