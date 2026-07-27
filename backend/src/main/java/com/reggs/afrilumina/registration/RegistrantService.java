package com.reggs.afrilumina.registration;

import com.reggs.afrilumina.email.EmailService;
import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrantService {

    private final RegistrantRepository registrantRepository;
    private final EmailService emailService;

    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        Registrant registrant = Registrant.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .country(request.country())
                .category(request.category())
                .message(request.message())
                .status(RegistrantStatus.NEW)
                .build();

        Registrant saved = registrantRepository.save(registrant);

        // Fire-and-forget confirmation email; failures here must never break registration.
        emailService.sendRegistrationConfirmation(saved);

        return toResponse(saved);
    }

    private RegistrationResponse toResponse(Registrant r) {
        return new RegistrationResponse(
                r.getId(), r.getFullName(), r.getEmail(), r.getPhone(),
                r.getCountry(), r.getCategory(), r.getStatus(), r.getCreatedAt()
        );
    }
}
