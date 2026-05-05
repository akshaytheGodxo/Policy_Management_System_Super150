package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal basePremium;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InsuranceType type;

    private BigDecimal coverageAmount;

    public enum InsuranceType {
        LIFE, HEALTH, VEHICLE, HOME
    }
}
