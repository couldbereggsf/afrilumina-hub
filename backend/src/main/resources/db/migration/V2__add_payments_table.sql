CREATE TABLE payment_transaction (
    id BIGINT AUTO_INCREMENT NOT NULL,
    registration_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(255) NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    purpose VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

ALTER TABLE payment_transaction
    ADD CONSTRAINT fk_payment_transaction_registration
    FOREIGN KEY (registration_id) REFERENCES registration(id);

CREATE INDEX idx_payment_provider_ref ON payment_transaction (provider_reference);
CREATE INDEX idx_payment_provider ON payment_transaction (provider);
CREATE INDEX idx_payment_status ON payment_transaction (status);