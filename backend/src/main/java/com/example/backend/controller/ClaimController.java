package com.example.backend.controller;

import com.example.backend.dto.ClaimRequestDTO;
import com.example.backend.dto.ClaimResponseDTO;
import com.example.backend.dto.ClaimStatusUpdateDTO;
import com.example.backend.model.User;
import com.example.backend.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(@Valid @RequestBody ClaimRequestDTO dto) {
        User currentUser = getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(claimService.createClaim(dto, currentUser));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClaimResponseDTO>> getUserClaims(@PathVariable Long userId) {
        return ResponseEntity.ok(claimService.getClaimsByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ClaimResponseDTO> updateClaimStatus(
            @PathVariable Long id,
            @Valid @RequestBody ClaimStatusUpdateDTO dto) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(claimService.updateClaimStatus(id, dto, currentUser.getRole()));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
}
