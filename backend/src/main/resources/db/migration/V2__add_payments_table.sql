CREATE TABLE payment_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registrant_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_reference VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    purpose VARCHAR(100),                         
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payment_registrant FOREIGN KEY (registrant_id) REFERENCES registrant(id),
    INDEX idx_payment_provider_ref (provider_reference),
    INDEX idx_payment_provider (provider),
    INDEX idx_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;