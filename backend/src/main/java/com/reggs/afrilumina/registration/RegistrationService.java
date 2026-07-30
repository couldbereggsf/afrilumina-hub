package com.reggs.afrilumina.registration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository repository;

    public List<Registration> findAll() {
        return repository.findAll();
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

    public List<Registration> seedDefaultData() {
        repository.deleteAll(); // Clear DB

        // Manually mapping the default registrations to Java objects
        Registration r1 = new Registration();
        r1.setName("Amina Yusuf");
        r1.setEmail("amina.yusuf@gmail.com");
        r1.setPhone("+254 712 345678");
        r1.setRole("student");
        r1.setDate(LocalDate.parse("2026-07-01"));
        r1.setStatus("approved");
        r1.setDetails("{\"program\":\"Lumina Mentorship Hub\",\"status\":\"Recent Graduate\",\"linkedin\":\"https://linkedin.com/in/aminayusuf\",\"motivation\":\"I want to transition into UX design.\"}");

        Registration r2 = new Registration();
        r2.setName("Dr. Chioma Adebayo");
        r2.setEmail("chioma.adebayo@unilag.edu.ng");
        r2.setPhone("+234 803 123 4567");
        r2.setRole("mentor");
        r2.setDate(LocalDate.parse("2026-07-02"));
        r2.setStatus("approved");
        r2.setDetails("{\"organization\":\"University of Lagos\",\"website\":\"https://unilag.edu.ng\",\"message\":\"I am passionate about empowering African young minds in science and tech.\"}");

        repository.save(r1);
        repository.save(r2);

        return repository.findAll();
    }
}