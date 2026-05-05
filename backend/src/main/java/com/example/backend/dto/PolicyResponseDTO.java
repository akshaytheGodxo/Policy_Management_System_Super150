package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyResponseDTO {
    private Long id;
    private String policyNumber;
    private String userName;
    private String productName;
    private BigDecimal premium;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String pdfPath;
}
