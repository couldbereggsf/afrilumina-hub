package com.reggs.afrilumina.admin;

import com.reggs.afrilumina.registration.Registrant;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final String[] HEADERS = {
            "ID", "Full Name", "Email", "Phone", "Country",
            "Category", "Status", "Message", "Registered At"
    };

    public byte[] exportRegistrants(List<Registrant> registrants) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Registrants");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Registrant r : registrants) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.getId());
                row.createCell(1).setCellValue(r.getFullName());
                row.createCell(2).setCellValue(r.getEmail());
                row.createCell(3).setCellValue(r.getPhone() == null ? "" : r.getPhone());
                row.createCell(4).setCellValue(r.getCountry() == null ? "" : r.getCountry());
                row.createCell(5).setCellValue(r.getCategory().name());
                row.createCell(6).setCellValue(r.getStatus().name());
                row.createCell(7).setCellValue(r.getMessage() == null ? "" : r.getMessage());
                row.createCell(8).setCellValue(r.getCreatedAt().format(DATE_FORMAT));
            }

            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel export", e);
        }
    }
}
