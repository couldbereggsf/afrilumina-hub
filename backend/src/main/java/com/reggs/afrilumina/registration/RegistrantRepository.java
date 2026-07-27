package com.reggs.afrilumina.registration;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrantRepository extends JpaRepository<Registrant, Long> {

    Page<Registrant> findByCategory(RegistrantCategory category, Pageable pageable);

    List<Registrant> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Registrant> findByCategoryAndCreatedAtBetween(
            RegistrantCategory category, LocalDateTime from, LocalDateTime to);

    boolean existsByEmailAndCategory(String email, RegistrantCategory category);
}
