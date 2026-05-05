package com.example.backend.repository;

import com.example.backend.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByUserId(Long userId);
    Optional<Policy> findByPolicyNumber(String policyNumber);
    List<Policy> findByStatus(Policy.PolicyStatus status);
    List<Policy> findByEndDateBetweenAndReminderSentFalse(LocalDateTime start, LocalDateTime end);
}
