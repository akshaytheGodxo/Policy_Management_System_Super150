package com.example.backend.repository;

import com.example.backend.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByUserId(Long userId);
    List<Claim> findByPolicyId(Long policyId);
    boolean existsByPolicyIdAndStatusIn(Long policyId, List<Claim.ClaimStatus> statuses);
}
