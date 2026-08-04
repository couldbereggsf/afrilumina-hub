package com.reggs.afrilumina.registration;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Page<Registration> findByCategory(RegistrationCategory category, Pageable pageable);

    List<Registration> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Registration> findByCategoryAndCreatedAtBetween(
            RegistrationCategory category, LocalDateTime from, LocalDateTime to);

    boolean existsByEmailAndCategory(String email, RegistrationCategory category);
}
