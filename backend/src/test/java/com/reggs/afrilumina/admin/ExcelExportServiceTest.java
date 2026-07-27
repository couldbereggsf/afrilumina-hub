package com.reggs.afrilumina.admin;

import com.reggs.afrilumina.registration.Registrant;
import com.reggs.afrilumina.registration.RegistrantCategory;
import com.reggs.afrilumina.registration.RegistrantStatus;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ExcelExportServiceTest {

    private final ExcelExportService service = new ExcelExportService();

    @Test
    void exportRegistrants_producesWorkbookWithHeaderAndDataRows() throws Exception {
        Registrant registrant = Registrant.builder()
                .id(1L)
                .fullName("Jane Doe")
                .email("jane@example.com")
                .phone("+254700000000")
                .country("Kenya")
                .category(RegistrantCategory.VOLUNTEER)
                .status(RegistrantStatus.NEW)
                .message("Excited to help!")
                .createdAt(LocalDateTime.of(2026, 6, 1, 10, 0))
                .build();

        byte[] bytes = service.exportRegistrants(List.of(registrant));

        assertThat(bytes).isNotEmpty();

        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("Registrants");
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("ID");
            assertThat(sheet.getRow(1).getCell(1).getStringCellValue()).isEqualTo("Jane Doe");
            assertThat(sheet.getRow(1).getCell(2).getStringCellValue()).isEqualTo("jane@example.com");
        }
    }
}
