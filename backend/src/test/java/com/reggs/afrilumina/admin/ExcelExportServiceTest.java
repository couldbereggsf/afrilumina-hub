package com.reggs.afrilumina.admin;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;

import com.reggs.afrilumina.registration.Registration;

class ExcelExportServiceTest {

    private final ExcelExportService service = new ExcelExportService();

    @Test
    void exportRegistrations_producesWorkbookWithHeaderAndDataRows() throws Exception {
        Registration registrationEntity = new Registration();
        registrationEntity.setId(1L);
        registrationEntity.setName("Jane Doe");
        registrationEntity.setEmail("jane@example.com");
        registrationEntity.setPhone("+254700000000");
        registrationEntity.setStatus(RegistrationStatus.NEW.name());
        registrationEntity.setCreatedAt(LocalDateTime.of(2026, 6, 1, 10, 0));

        byte[] bytes = service.exportRegistrations(List.of(registrationEntity));

        assertThat(bytes).isNotEmpty();

        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("registrations");
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("ID");
            assertThat(sheet.getRow(1).getCell(1).getStringCellValue()).isEqualTo("Jane Doe");
            assertThat(sheet.getRow(1).getCell(2).getStringCellValue()).isEqualTo("jane@example.com");
        }
    }
}
