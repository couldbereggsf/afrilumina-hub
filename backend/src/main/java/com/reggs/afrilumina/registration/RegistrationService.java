package com.reggs.afrilumina.registration;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;


@Service
public class RegistrationService {

    private final JpaRepository<Registration, Long> repository;

    public RegistrationService(JpaRepository<Registration, Long> repository) {
        this.repository = repository;
    }

    public List<Registration> findAll() {
        return repository.findAll();
    }

    public Optional<Registration> findById(Long id) {
        return repository.findById(id);
    }

    public Registration save(Registration registration) {
        // If it's a new registration, ensure it has a default status
        if (registration.getId() == null && registration.getStatus() == null) {
            registration.setStatus("NEW");
        }
        return repository.save(registration);
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
        r1.setCategory(RegistrationCategory.STUDENT);
        r1.setRole("student");
        r1.setDetails("{\"program\":\"Lumina Mentorship Hub\",\"status\":\"Recent Graduate\",\"country\":\"Kenya\"}");
        r1.setStatus("approved");
        r1.setDate(LocalDate.now());
        repository.save(r1);

        Registration r2 = new Registration();
        r2.setName("Dr. Chioma Adebayo");
        r2.setEmail("chioma.adebayo@unilag.edu.ng");
        r2.setPhone("+234 803 123 4567");
        r2.setCategory(RegistrationCategory.MENTOR);
        r2.setRole("mentor");
        r2.setDetails("{\"organization\":\"University of Lagos\",\"country\":\"Nigeria\"}");
        r2.setStatus("approved");
        r2.setDate(LocalDate.now());
        repository.save(r2);

        return repository.findAll();
    }

    RegistrationResponse register(RegistrationRequest request) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}