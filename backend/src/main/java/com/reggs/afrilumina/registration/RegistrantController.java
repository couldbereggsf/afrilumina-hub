package com.reggs.afrilumina.registration;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrantController {

    private final RegistrantService registrantService;

    /**
     * Public endpoint - called from the AfriLumina Hub site's signup form
     * (volunteer / mentor / partner / program applicant / donor).
     */
    /*
    @PostMapping
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrantService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
        */
}
