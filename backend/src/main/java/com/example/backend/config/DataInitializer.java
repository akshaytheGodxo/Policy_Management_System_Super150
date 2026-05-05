package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(User.builder()
                        .email("admin@insurance.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("Admin User")
                        .age(35)
                        .smoker(false)
                        .role(User.Role.ADMIN)
                        .build());

                userRepository.save(User.builder()
                        .email("adjuster@insurance.com")
                        .password(passwordEncoder.encode("adjuster123"))
                        .name("Claims Adjuster")
                        .age(40)
                        .smoker(false)
                        .role(User.Role.ADJUSTER)
                        .build());

                userRepository.save(User.builder()
                        .email("customer@test.com")
                        .password(passwordEncoder.encode("customer123"))
                        .name("John Customer")
                        .age(45)
                        .smoker(true)
                        .role(User.Role.CUSTOMER)
                        .build());
            }
        };
    }
}
