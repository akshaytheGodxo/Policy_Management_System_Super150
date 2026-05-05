package com.example.backend.controller;

import com.example.backend.dto.PolicyPurchaseDTO;
import com.example.backend.dto.PolicyResponseDTO;
import com.example.backend.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping("/purchase")
    public ResponseEntity<PolicyResponseDTO> purchasePolicy(@Valid @RequestBody PolicyPurchaseDTO dto) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(policyService.purchasePolicy(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PolicyResponseDTO>> getUserPolicies(@PathVariable Long userId) {
        return ResponseEntity.ok(policyService.getPoliciesByUserId(userId));
    }
}
