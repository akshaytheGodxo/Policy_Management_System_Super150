package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Document;
import com.example.backend.model.User;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public Document uploadFile(MultipartFile file, Long userId, Document.DocumentType type) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String subDir = type == Document.DocumentType.KYC ? "kyc" : "claims";
        Path dirPath = Paths.get(uploadDir, subDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = dirPath.resolve(filename);

        Files.write(filePath, file.getBytes());

        String relativePath = "/uploads/" + subDir + "/" + filename;

        return documentRepository.save(Document.builder()
                .user(user)
                .type(type)
                .filePath(relativePath)
                .uploadedAt(LocalDateTime.now())
                .build());
    }

    public byte[] downloadFile(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir, filename.replace("/uploads/", ""));
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found: " + filename);
        }
        return Files.readAllBytes(filePath);
    }
}
