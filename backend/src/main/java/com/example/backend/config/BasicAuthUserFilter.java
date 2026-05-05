package com.example.backend.config;

import com.example.backend.model.Policy;
import com.example.backend.model.User;
import com.example.backend.repository.PolicyRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class BasicAuthUserFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final AuthenticationConfiguration authConfig;

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Basic ")) {
            String[] credentials = decodeBasicAuth(authHeader);
            if (credentials != null) {
                String email = credentials[0];
                String password = credentials[1];
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    org.springframework.security.crypto.password.PasswordEncoder encoder =
                            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
                    if (encoder.matches(password, user.getPassword())) {
                        SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                        user, null,
                                        List.of(new SimpleGrantedAuthority(user.getRole().name()))
                                )
                        );
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String[] decodeBasicAuth(String header) {
        try {
            String base64 = header.substring(6);
            String decoded = new String(java.util.Base64.getDecoder().decode(base64));
            String[] parts = decoded.split(":", 2);
            if (parts.length == 2) return parts;
        } catch (Exception ignored) {}
        return null;
    }
}
