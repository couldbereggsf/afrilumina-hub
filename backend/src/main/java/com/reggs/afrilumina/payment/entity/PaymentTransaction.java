package com.reggs.afrilumina.payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private com.reggs.afrilumina.registration.Registration registration;

    private String provider;               // "MPESA" or "PAYPAL"
    private String providerReference;      // CheckoutRequestID from Daraja
    private BigDecimal amount;
    private String currency;               // KES, USD, etc.
    private String purpose;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // No-args constructor (required by JPA)
    public PaymentTransaction() {}

    // All-args constructor for builder
    private PaymentTransaction(Builder builder) {
        this.registration = builder.registration;
        this.provider = builder.provider;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.purpose = builder.purpose;
        this.status = builder.status;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    // Builder pattern
    public static class Builder {
        private com.reggs.afrilumina.registration.Registration registration;
        private String provider;
        private BigDecimal amount;
        private String currency;
        private String purpose;
        private PaymentStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder registration(com.reggs.afrilumina.registration.Registration registration) {
            this.registration = registration;
            return this;
        }
        public Builder provider(String provider) {
            this.provider = provider;
            return this;
        }
        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }
        public Builder purpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public Builder status(PaymentStatus status) {
            this.status = status;
            return this;
        }
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        public PaymentTransaction build() {
            return new PaymentTransaction(this);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public com.reggs.afrilumina.registration.Registration getRegistration() { return registration; }
    public void setRegistration(com.reggs.afrilumina.registration.Registration registration) { this.registration = registration; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderReference() { return providerReference; }
    public void setProviderReference(String providerReference) { this.providerReference = providerReference; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}