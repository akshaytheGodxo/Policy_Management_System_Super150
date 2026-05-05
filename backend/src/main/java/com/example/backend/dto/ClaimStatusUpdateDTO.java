package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimStatusUpdateDTO {
    @NotBlank
    private String status;

    private String reviewNotes;
}
