package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumRequestDTO {
    private Long productId;
    private Integer age;
    private Boolean smoker;
    private BigDecimal coverageAmount;
    private Boolean isSportsVehicle;
}
