CREATE TABLE admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    category VARCHAR(50) NOT NULL,        -- VOLUNTEER, MENTOR, PARTNER, PROGRAM_APPLICANT, DONOR
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',  -- NEW, CONTACTED, CONFIRMED, ARCHIVED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registration_email ON registration(email);
CREATE INDEX idx_registration_category ON registration(category);
CREATE INDEX idx_registration_created_at ON registration(created_at);