package com.reggs.afrilumina.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI afriluminaOpenApi() {
        return new OpenAPI().info(new Info()
                .title("AfriLumina Hub API")
                .description("Registration, payments (M-Pesa/PayPal), and admin reporting for AfriLumina Hub")
                .version("0.1.0"));
    }
}