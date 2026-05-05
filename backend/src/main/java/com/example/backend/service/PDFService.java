package com.example.backend.service;

import com.example.backend.model.Policy;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class PDFService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public String generatePolicyPDF(Policy policy) throws Exception {
        Path policyDir = Paths.get(uploadDir, "policies");
        if (!Files.exists(policyDir)) {
            Files.createDirectories(policyDir);
        }

        String filename = policy.getPolicyNumber() + ".pdf";
        Path filePath = policyDir.resolve(filename);

        try (PdfWriter writer = new PdfWriter(filePath.toString());
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, PageSize.A4)) {

            document.setMargins(40, 40, 40, 40);

            Paragraph title = new Paragraph("INSURANCE POLICY")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.DARK_GRAY);
            document.add(title);

            document.add(new Paragraph("\n"));

            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
            table.setWidth(UnitValue.createPercentValue(100));

            addTableRow(table, "Policy Number", policy.getPolicyNumber());
            addTableRow(table, "Policy Holder", policy.getUser().getName());
            addTableRow(table, "Email", policy.getUser().getEmail());
            addTableRow(table, "Product", policy.getProduct().getName());
            addTableRow(table, "Type", policy.getProduct().getType().toString());
            addTableRow(table, "Premium", "$" + policy.getPremium().toString());
            addTableRow(table, "Start Date", policy.getStartDate().toString());
            addTableRow(table, "End Date", policy.getEndDate().toString());
            addTableRow(table, "Status", policy.getStatus().toString());

            document.add(table);

            document.add(new Paragraph("\n"));

            try {
                BufferedImage qrImage = generateQRCode(policy.getPolicyNumber(), 100, 100);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                javax.imageio.ImageIO.write(qrImage, "PNG", baos);
                byte[] qrBytes = baos.toByteArray();

                ImageData imageData = ImageDataFactory.create(qrBytes);
                Image qr = new Image(imageData);
                qr.setWidth(100);
                qr.setHeight(100);
                qr.setTextAlignment(TextAlignment.CENTER);
                document.add(qr);
            } catch (Exception e) {
                document.add(new Paragraph("[QR Code generation skipped]")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setFontColor(ColorConstants.GRAY));
            }

            document.add(new Paragraph("\n"));
            Paragraph disclaimer = new Paragraph("This is a computer-generated document. No signature required.")
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.GRAY);
            document.add(disclaimer);
        }

        return "/uploads/policies/" + filename;
    }

    private void addTableRow(Table table, String key, String value) {
        table.addCell(new Paragraph(key).setBold().setBackgroundColor(ColorConstants.LIGHT_GRAY));
        table.addCell(new Paragraph(value));
    }

    private BufferedImage generateQRCode(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }
}
