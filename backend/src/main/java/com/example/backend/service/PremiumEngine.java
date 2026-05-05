package com.example.backend.service;

import com.example.backend.dto.PremiumRequestDTO;
import com.example.backend.dto.PremiumResponseDTO;
import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PremiumEngine {

    private final ProductRepository productRepository;

    public PremiumResponseDTO calculatePremium(PremiumRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        BigDecimal basePremium = product.getBasePremium();
        BigDecimal ageSurcharge = BigDecimal.ZERO;
        BigDecimal smokerSurcharge = BigDecimal.ZERO;
        BigDecimal coverageSurcharge = BigDecimal.ZERO;
        BigDecimal sportsVehicleSurcharge = BigDecimal.ZERO;

        if (request.getAge() != null && request.getAge() > 50) {
            ageSurcharge = basePremium.multiply(new BigDecimal("0.20"));
        }

        if (Boolean.TRUE.equals(request.getSmoker())) {
            smokerSurcharge = basePremium.multiply(new BigDecimal("0.30"));
        }

        if (request.getCoverageAmount() != null && product.getCoverageAmount() != null
                && request.getCoverageAmount().compareTo(product.getCoverageAmount().multiply(new BigDecimal("0.8"))) > 0) {
            coverageSurcharge = basePremium.multiply(new BigDecimal("0.15"));
        }

        if (Boolean.TRUE.equals(request.getIsSportsVehicle())
                && product.getType() == Product.InsuranceType.VEHICLE) {
            sportsVehicleSurcharge = basePremium.multiply(new BigDecimal("0.25"));
        }

        BigDecimal finalPremium = basePremium
                .add(ageSurcharge)
                .add(smokerSurcharge)
                .add(coverageSurcharge)
                .add(sportsVehicleSurcharge)
                .setScale(2, RoundingMode.HALF_UP);

        return PremiumResponseDTO.builder()
                .basePremium(basePremium)
                .ageSurcharge(ageSurcharge)
                .smokerSurcharge(smokerSurcharge)
                .coverageSurcharge(coverageSurcharge)
                .sportsVehicleSurcharge(sportsVehicleSurcharge)
                .finalPremium(finalPremium)
                .build();
    }
}
