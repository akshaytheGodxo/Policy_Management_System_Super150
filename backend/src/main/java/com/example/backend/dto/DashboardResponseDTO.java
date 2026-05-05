package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {
    private java.util.List<PolicyResponseDTO> policies;
    private java.util.List<ClaimResponseDTO> claims;
}
