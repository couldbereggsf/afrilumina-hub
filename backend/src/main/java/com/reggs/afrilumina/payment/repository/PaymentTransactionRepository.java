package com.reggs.afrilumina.payment.repository;

import com.reggs.afrilumina.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;



import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByProviderReference(String providerReference);
}