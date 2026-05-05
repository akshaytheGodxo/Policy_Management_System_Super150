package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequestDTO {
    @NotNull
    private Long policyId;

    private String description;

    @NotNull
    @DecimalMin(value = "0.01", message = "Claim amount must be positive")
    private BigDecimal claimAmount;
}
