CREATE TABLE admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrant (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    category VARCHAR(50) NOT NULL,        -- VOLUNTEER, MENTOR, PARTNER, PROGRAM_APPLICANT, DONOR
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',  -- NEW, CONTACTED, CONFIRMED, ARCHIVED
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registrant_email ON registrant(email);
CREATE INDEX idx_registrant_category ON registrant(category);
CREATE INDEX idx_registrant_created_at ON registrant(created_at);
