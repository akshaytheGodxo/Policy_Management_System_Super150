package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumResponseDTO {
    private BigDecimal basePremium;
    private BigDecimal ageSurcharge;
    private BigDecimal smokerSurcharge;
    private BigDecimal coverageSurcharge;
    private BigDecimal sportsVehicleSurcharge;
    private BigDecimal finalPremium;
}
