package com.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final BasicAuthUserFilter basicAuthUserFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .requestMatchers("/api/claims/all").hasAnyAuthority("ADMIN", "ADJUSTER")
                .requestMatchers("/api/claims/*/status").hasAnyAuthority("ADMIN", "ADJUSTER")
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/files/**").permitAll()
                .requestMatchers("/api/premium/**").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                .anyRequest().permitAll()
            )
            .headers(h -> h.frameOptions(f -> f.sameOrigin()))
            .addFilterBefore(basicAuthUserFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(httpBasic -> {});

        return http.build();
    }
}
