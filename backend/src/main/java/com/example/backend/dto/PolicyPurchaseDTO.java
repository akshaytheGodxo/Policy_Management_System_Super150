package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyPurchaseDTO {
    @NotNull
    private Long userId;

    @NotNull
    private Long productId;

    private Integer age;
    private Boolean smoker;
    private Boolean isSportsVehicle;
}
