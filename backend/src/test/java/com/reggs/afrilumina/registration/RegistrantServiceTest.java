package com.reggs.afrilumina.registration;

import com.reggs.afrilumina.email.EmailService;
import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrantServiceTest {

    @Mock
    private RegistrantRepository registrantRepository;

    @Mock
    private EmailService emailService;

    @Test
    void register_savesRegistrantAndSendsConfirmationEmail() {
        RegistrantService service = new RegistrantService(registrantRepository, emailService);

        RegistrationRequest request = new RegistrationRequest(
                "Jane Doe", "jane@example.com", "+254700000000", "Kenya",
                RegistrantCategory.MENTOR, "Happy to mentor!");

        when(registrantRepository.save(any(Registrant.class))).thenAnswer(invocation -> {
            Registrant r = invocation.getArgument(0);
            r.setId(42L);
            r.setCreatedAt(LocalDateTime.now());
            return r;
        });

        RegistrationResponse response = service.register(request);

        assertThat(response.id()).isEqualTo(42L);
        assertThat(response.email()).isEqualTo("jane@example.com");
        assertThat(response.category()).isEqualTo(RegistrantCategory.MENTOR);
        assertThat(response.status()).isEqualTo(RegistrantStatus.NEW);

        ArgumentCaptor<Registrant> captor = ArgumentCaptor.forClass(Registrant.class);
        verify(registrantRepository).save(captor.capture());
        assertThat(captor.getValue().getFullName()).isEqualTo("Jane Doe");

        verify(emailService).sendRegistrationConfirmation(any(Registrant.class));
    }
}
