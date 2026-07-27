package com.reggs.afrilumina.config;

import com.reggs.afrilumina.auth.AdminUser;
import com.reggs.afrilumina.auth.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_SEED_EMAIL:}")
    private String seedEmail;

    @Value("${ADMIN_SEED_PASSWORD:}")
    private String seedPassword;

    @Value("${ADMIN_SEED_NAME:Admin}")
    private String seedName;

    @Override
    public void run(String... args) {
        if (!StringUtils.hasText(seedEmail) || !StringUtils.hasText(seedPassword)) {
            log.info("No ADMIN_SEED_EMAIL/ADMIN_SEED_PASSWORD set - skipping admin seeding. " +
                    "Set these env vars to auto-create the first admin account.");
            return;
        }

        if (adminUserRepository.findByEmail(seedEmail).isPresent()) {
            return; // already seeded
        }

        AdminUser admin = AdminUser.builder()
                .email(seedEmail)
                .passwordHash(passwordEncoder.encode(seedPassword))
                .fullName(seedName)
                .role("ADMIN")
                .build();

        adminUserRepository.save(admin);
        log.info("Seeded initial admin user: {}", seedEmail);
    }
}
