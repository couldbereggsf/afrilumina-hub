package com.reggs.afrilumina.registration;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;
    private Object NEW;

    @Test
    void register_savesRegistration() {
        RegistrationService service = new RegistrationService(registrationRepository);

        RegistrationRequest request = new RegistrationRequest(
                "Jane Doe", "jane@example.com", "+254700000000", "Kenya",
                RegistrationCategory.MENTOR, "Happy to mentor!");

        when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> {
            Registration r = invocation.getArgument(0);
            r.setId(42L);
            r.setCreatedAt(LocalDateTime.now());
            return r;
        });

        RegistrationResponse response = service.register(request);

        assertThat(response.id()).isEqualTo(42L);
        assertThat(response.email()).isEqualTo("jane@example.com");
        assertThat(response.category()).isEqualTo(RegistrationCategory.MENTOR);
        assertThat(response.status()).isEqualTo(NEW);

        ArgumentCaptor<Registration> captor = ArgumentCaptor.forClass(Registration.class);
        verify(registrationRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Jane Doe");
    }

    public RegistrationRepository getRegistrationRepository() {
        return registrationRepository;
    }

    public void setRegistrationRepository(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    public Object getNEW() {
        return NEW;
    }

    public void setNEW(Object nEW) {
        NEW = nEW;
    }
}