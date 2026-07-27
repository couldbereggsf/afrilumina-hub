package com.reggs.afrilumina.registration;

import com.reggs.afrilumina.registration.dto.RegistrationRequest;
import com.reggs.afrilumina.registration.dto.RegistrationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrantController {

    private final RegistrantService registrantService;

    /**
     * Public endpoint - called from the AfriLumina Hub site's signup form
     * (volunteer / mentor / partner / program applicant / donor).
     */
    @PostMapping
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrantService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
