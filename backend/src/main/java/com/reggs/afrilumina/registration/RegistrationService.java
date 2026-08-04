package com.reggs.afrilumina.registration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reggs.afrilumina.email.EmailService;
import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;

@Service
public class RegistrationService {

    private final RegistrationRepository repository;
    private final EmailService emailService;

    public RegistrationService(RegistrationRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public List<Registration> findAll() {
        return repository.findAll();
    }

    public Optional<Registration> findById(Long id) {
        return repository.findById(id);
    }

    public Registration save(Registration registration) {
        if (registration.getId() == null && registration.getStatus() == null) {
            registration.setStatus("NEW");
        }
        return repository.save(registration);
    }

    public RegistrationResponse register(RegistrationRequest request) {
        Registration registration = new Registration();
        registration.setName(request.name());
        registration.setEmail(request.email());
        registration.setPhone(request.phone());
        registration.setCategory(request.category());
        registration.setStatus("NEW");
        registration.setCreatedAt(LocalDateTime.now());

        // Mapping the record fields to the Entity
        registration.setCountry(request.country());

        // The comment says: "country and message... get folded into the details JSON blob"
        String detailsJson = String.format("{\"country\":\"%s\",\"message\":\"%s\"}", 
                request.country() != null ? request.country() : "", 
                request.message() != null ? request.message() : "");
        registration.setDetails(detailsJson);

        Registration saved = repository.save(registration);

        emailService.sendRegistrationConfirmation(saved);

        // FIXED: Swapped the order of details and status to match the Record signature
        return new RegistrationResponse(
            saved.getId(),
            saved.getName(),
            saved.getEmail(),
            saved.getPhone(),
            saved.getCountry(),
            saved.getCategory(),
            saved.getDetails(), // <--- 7th argument: String details
            saved.getStatus(),  // <--- 8th argument: String status
            saved.getDate(),    // <--- 9th argument: LocalDate date
            saved.getCreatedAt()
        );
    }

    public Registration updateStatus(Long id, String status) {
        Optional<Registration> existing = repository.findById(id);
        if (existing.isPresent()) {
            Registration reg = existing.get();
            reg.setStatus(status);
            return repository.save(reg);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    @Transactional
    public List<Registration> seedDefaultData() {
        repository.deleteAll();

        Registration r1 = new Registration();
        r1.setName("Amina Yusuf");
        r1.setEmail("amina.yusuf@gmail.com");
        r1.setPhone("+254 712 345678");
        r1.setCountry("Kenya");
        r1.setCategory(RegistrationCategory.STUDENT);
        r1.setDetails("{\"program\":\"Lumina Mentorship Hub\",\"status\":\"Recent Graduate\",\"country\":\"Kenya\"}");
        r1.setStatus("approved");
        r1.setDate(LocalDateTime.now().toLocalDate());
        r1.setCreatedAt(LocalDateTime.now());
        repository.save(r1);

        Registration r2 = new Registration();
        r2.setName("Dr. Chioma Adebayo");
        r2.setEmail("chioma.adebayo@unilag.edu.ng");
        r2.setPhone("+234 803 123 4567");
        r2.setCountry("Nigeria");
        r2.setCategory(RegistrationCategory.MENTOR);
        r2.setDetails("{\"organization\":\"University of Lagos\",\"country\":\"Nigeria\"}");
        r2.setStatus("approved");
        r2.setDate(LocalDateTime.now().toLocalDate());
        r2.setCreatedAt(LocalDateTime.now());
        repository.save(r2);

        return repository.findAll();
    }
}