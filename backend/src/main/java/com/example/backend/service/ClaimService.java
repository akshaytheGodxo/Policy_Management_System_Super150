package com.example.backend.service;

import com.example.backend.dto.ClaimRequestDTO;
import com.example.backend.dto.ClaimResponseDTO;
import com.example.backend.dto.ClaimStatusUpdateDTO;
import com.example.backend.exception.DuplicateClaimException;
import com.example.backend.exception.InvalidTransitionException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.model.Claim;
import com.example.backend.model.Policy;
import com.example.backend.model.User;
import com.example.backend.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyService policyService;

    private static final Map<Claim.ClaimStatus, Set<Claim.ClaimStatus>> VALID_TRANSITIONS = Map.of(
            Claim.ClaimStatus.SUBMITTED, Set.of(Claim.ClaimStatus.UNDER_REVIEW, Claim.ClaimStatus.REJECTED),
            Claim.ClaimStatus.UNDER_REVIEW, Set.of(Claim.ClaimStatus.APPROVED, Claim.ClaimStatus.REJECTED),
            Claim.ClaimStatus.APPROVED, Set.of(Claim.ClaimStatus.DISBURSED)
    );

    @Transactional
    public ClaimResponseDTO createClaim(ClaimRequestDTO dto, User currentUser) {
        Policy policy = policyService.getPolicyEntityById(dto.getPolicyId());

        if (!policy.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Cannot claim on another user's policy");
        }

        if (policy.getStatus() != Policy.PolicyStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot claim on inactive or expired policy");
        }

        if (policy.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot claim on expired policy");
        }

        List<Claim.ClaimStatus> activeStatuses = List.of(
                Claim.ClaimStatus.SUBMITTED, Claim.ClaimStatus.UNDER_REVIEW, Claim.ClaimStatus.APPROVED);
        if (claimRepository.existsByPolicyIdAndStatusIn(policy.getId(), activeStatuses)) {
            throw new DuplicateClaimException("An active claim already exists for this policy");
        }

        Claim claim = Claim.builder()
                .policy(policy)
                .user(currentUser)
                .description(dto.getDescription())
                .claimAmount(dto.getClaimAmount())
                .status(Claim.ClaimStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        claim = claimRepository.save(claim);
        return mapToResponseDTO(claim);
    }

    public List<ClaimResponseDTO> getClaimsByUserId(Long userId) {
        return claimRepository.findByUserId(userId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional
    public ClaimResponseDTO updateClaimStatus(Long claimId, ClaimStatusUpdateDTO dto, User.Role userRole) {
        if (userRole != User.Role.ADMIN && userRole != User.Role.ADJUSTER) {
            throw new UnauthorizedException("Only ADMIN or ADJUSTER can update claim status");
        }

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Claim.ClaimStatus newStatus;
        try {
            newStatus = Claim.ClaimStatus.valueOf(dto.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid claim status: " + dto.getStatus());
        }

        Set<Claim.ClaimStatus> allowedTransitions = VALID_TRANSITIONS.get(claim.getStatus());
        if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
            throw new InvalidTransitionException(
                    "Invalid transition from " + claim.getStatus() + " to " + newStatus);
        }

        claim.setStatus(newStatus);
        claim.setReviewedAt(LocalDateTime.now());
        claim.setReviewNotes(dto.getReviewNotes());
        claim = claimRepository.save(claim);

        return mapToResponseDTO(claim);
    }

    private ClaimResponseDTO mapToResponseDTO(Claim claim) {
        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .policyNumber(claim.getPolicy().getPolicyNumber())
                .userName(claim.getUser().getName())
                .description(claim.getDescription())
                .claimAmount(claim.getClaimAmount())
                .status(claim.getStatus().name())
                .submittedAt(claim.getSubmittedAt())
                .reviewedAt(claim.getReviewedAt())
                .reviewNotes(claim.getReviewNotes())
                .build();
    }
}
