package com.reggs.afrilumina.registration;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173") // Crucial for React to talk to my Spring
@RequiredArgsConstructor
@Slf4j
public class RegistrationController {

    private final RegistrationService service;

    // GET all registrations
    @GetMapping
    public List<Registration> getAll() {
        return service.findAll();
    }

    // GET one registration
    @GetMapping("/{id}")
    public ResponseEntity<Registration> getOne(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE a new registration which handles resumeFileName
    @PostMapping
    public ResponseEntity<?> createRegistration(@RequestBody Registration registration) {
        try {
            Registration saved = service.save(registration);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to create registration", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // UPDATE status only
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Registration updated = service.updateStatus(id, body.get("status"));
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to update registration status for id={}", id, e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    // SEED database (Reset button)
    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        try {
            List<Registration> seeded = service.seedDefaultData();
            return ResponseEntity.ok(seeded);
        } catch (Exception e) {
            log.error("Failed to seed registration data", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}