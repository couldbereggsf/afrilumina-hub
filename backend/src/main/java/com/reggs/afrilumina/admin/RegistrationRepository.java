package com.reggs.afrilumina.admin;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.reggs.afrilumina.registration.Registration;
import com.reggs.afrilumina.registration.RegistrationCategory;

/**
 * RegistrationRepository
 */
public enum RegistrationRepository {
    ;

    Page<Registration> findByCategory(RegistrationCategory category, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByCategory'");
    }

    Page<Registration> findAll(Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    List<Registration> findByCategoryAndCreatedAtBetween(RegistrationCategory category, LocalDateTime fromDate,
            LocalDateTime toDate) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByCategoryAndCreatedAtBetween'");
    }

    List<Registration> findByCreatedAtBetween(LocalDateTime fromDate, LocalDateTime toDate) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByCreatedAtBetween'");
    }

}
