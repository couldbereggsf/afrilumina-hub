package com.reggs.afrilumina.email;

import com.reggs.afrilumina.registration.Registrant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendRegistrationConfirmation(Registrant registrant) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(registrant.getEmail());
            message.setSubject("Thanks for joining AfriLumina Hub!");
            message.setText("""
                    Hi %s,

                    Thank you for registering with AfriLumina Hub as a %s.
                    Our team will be in touch shortly.

                    - The AfriLumina Hub Team
                    """.formatted(registrant.getFullName(), registrant.getCategory()));
            mailSender.send(message);
        } catch (Exception e) {
            // Never let an email failure break a registration or payment flow.
            log.warn("Failed to send confirmation email to {}: {}", registrant.getEmail(), e.getMessage());
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
