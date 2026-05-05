package com.example.backend.controller;

import com.example.backend.dto.ClaimResponseDTO;
import com.example.backend.dto.DashboardResponseDTO;
import com.example.backend.dto.PolicyResponseDTO;
import com.example.backend.service.ClaimService;
import com.example.backend.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PolicyService policyService;
    private final ClaimService claimService;

    @GetMapping("/policies/user/{userId}")
    public ResponseEntity<List<PolicyResponseDTO>> getUserPolicies(@PathVariable Long userId) {
        return ResponseEntity.ok(policyService.getPoliciesByUserId(userId));
    }

    @GetMapping("/claims/user/{userId}")
    public ResponseEntity<List<ClaimResponseDTO>> getUserClaims(@PathVariable Long userId) {
        return ResponseEntity.ok(claimService.getClaimsByUserId(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DashboardResponseDTO> getUserDashboard(@PathVariable Long userId) {
        List<PolicyResponseDTO> policies = policyService.getPoliciesByUserId(userId);
        List<ClaimResponseDTO> claims = claimService.getClaimsByUserId(userId);
        return ResponseEntity.ok(DashboardResponseDTO.builder()
                .policies(policies)
                .claims(claims)
                .build());
    }
}
