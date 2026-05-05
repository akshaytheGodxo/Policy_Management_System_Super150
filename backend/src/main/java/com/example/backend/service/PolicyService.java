package com.example.backend.service;

import com.example.backend.dto.PolicyPurchaseDTO;
import com.example.backend.dto.PolicyResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Policy;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.PolicyRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PremiumEngine premiumEngine;
    private final PDFService pdfService;

    @Transactional
    public PolicyResponseDTO purchasePolicy(PolicyPurchaseDTO dto) throws Exception {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        com.example.backend.dto.PremiumRequestDTO premiumRequest = com.example.backend.dto.PremiumRequestDTO.builder()
                .productId(product.getId())
                .age(dto.getAge() != null ? dto.getAge() : user.getAge())
                .smoker(dto.getSmoker() != null ? dto.getSmoker() : user.getSmoker())
                .isSportsVehicle(dto.getIsSportsVehicle())
                .build();

        BigDecimal premium = premiumEngine.calculatePremium(premiumRequest).getFinalPremium();

        String policyNumber = generatePolicyNumber(user, product);

        LocalDateTime now = LocalDateTime.now();
        Policy policy = Policy.builder()
                .policyNumber(policyNumber)
                .user(user)
                .product(product)
                .premium(premium)
                .startDate(now)
                .endDate(now.plusYears(1))
                .status(Policy.PolicyStatus.ACTIVE)
                .build();

        policy = policyRepository.save(policy);

        String pdfPath = pdfService.generatePolicyPDF(policy);
        policy.setPdfPath(pdfPath);
        policy = policyRepository.save(policy);

        return mapToResponseDTO(policy);
    }

    public PolicyResponseDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        return mapToResponseDTO(policy);
    }

    public List<PolicyResponseDTO> getPoliciesByUserId(Long userId) {
        return policyRepository.findByUserId(userId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Policy getPolicyEntityById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
    }

    public void approvePolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        policy.setStatus(Policy.PolicyStatus.ACTIVE);
        policyRepository.save(policy);
    }

    private String generatePolicyNumber(User user, Product product) {
        String prefix = product.getType().name().substring(0, 3).toUpperCase();
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + "-" + user.getId() + "-" + uuid;
    }

    private PolicyResponseDTO mapToResponseDTO(Policy policy) {
        return PolicyResponseDTO.builder()
                .id(policy.getId())
                .policyNumber(policy.getPolicyNumber())
                .userName(policy.getUser().getName())
                .productName(policy.getProduct().getName())
                .premium(policy.getPremium())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .status(policy.getStatus().name())
                .pdfPath(policy.getPdfPath())
                .build();
    }
}
