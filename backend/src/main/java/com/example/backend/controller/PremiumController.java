package com.example.backend.controller;

import com.example.backend.dto.PremiumRequestDTO;
import com.example.backend.dto.PremiumResponseDTO;
import com.example.backend.service.PremiumEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/premium")
@RequiredArgsConstructor
public class PremiumController {

    private final PremiumEngine premiumEngine;

    @PostMapping("/calculate")
    public ResponseEntity<PremiumResponseDTO> calculatePremium(@RequestBody PremiumRequestDTO request) {
        return ResponseEntity.ok(premiumEngine.calculatePremium(request));
    }
}
