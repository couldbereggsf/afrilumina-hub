package com.reggs.afrilumina.email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.reggs.afrilumina.registration.Registration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    private String resolveFullName(Registration registration) {
        try {
            Object fullName = registration.getClass().getMethod("getFullName").invoke(registration);
            if (fullName != null) {
                return fullName.toString();
            }
        } catch (Exception ignored) {
            // Fall through to other supported getters.
        }

        try {
            Object name = registration.getClass().getMethod("getName").invoke(registration);
            if (name != null) {
                return name.toString();
            }
        } catch (Exception ignored) {
            // Fall through to other supported getters.
        }

        try {
            Object firstName = registration.getClass().getMethod("getFirstName").invoke(registration);
            Object lastName = registration.getClass().getMethod("getLastName").invoke(registration);
            if (firstName != null || lastName != null) {
                return String.format("%s %s",
                        firstName != null ? firstName : "",
                        lastName != null ? lastName : "").trim();
            }
        } catch (Exception ignored) {
            // Fall through to empty string.
        }

        return "there";
    }

    private String resolveCategory(Registration registration) {
        try {
            Object category = registration.getClass().getMethod("getCategory").invoke(registration);
            if (category != null) {
                return category.toString();
            }
        } catch (Exception ignored) {
            // Fall through to other supported getters.
        }

        try {
            Object role = registration.getClass().getMethod("getRole").invoke(registration);
            if (role != null) {
                return role.toString();
            }
        } catch (Exception ignored) {
            // Fall through to other supported getters.
        }

        try {
            Object accountType = registration.getClass().getMethod("getAccountType").invoke(registration);
            if (accountType != null) {
                return accountType.toString();
            }
        } catch (Exception ignored) {
            // Fall through to default string.
        }

        return "member";
    }

    @Async
    public void sendRegistrationConfirmation(Registration registration) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(registration.getEmail());
            message.setSubject("Thanks for joining AfriLumina Hub!");
            message.setText(String.format(
                    "Hi %s,\n\n" +
                            "Thank you for registering with AfriLumina Hub as a %s.\n" +
                            "Our team will be in touch shortly.\n\n" +
                            "- The AfriLumina Hub Team\n",
                    resolveFullName(registration),
                    resolveCategory(registration)
            ));
            mailSender.send(message);
        } catch (Exception e) {
            // Never let an email failure break a registration or payment flow.
            log.warn("Failed to send confirmation email to {}: {}", registration.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendPaymentReceipt(String toEmail, String fullName, String amount, String currency) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your AfriLumina Hub payment receipt");
            message.setText("""
                    Hi %s,

                    We've received your payment of %s %s. Thank you for supporting AfriLumina Hub!

                    - The AfriLumina Hub Team
                    """.formatted(fullName, amount, currency));
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send payment receipt to {}: {}", toEmail, e.getMessage());
        }
    }
}
