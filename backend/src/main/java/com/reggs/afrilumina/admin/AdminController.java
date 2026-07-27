package com.reggs.afrilumina.admin;

import com.reggs.afrilumina.registration.Registrant;
import com.reggs.afrilumina.registration.RegistrantCategory;
import com.reggs.afrilumina.registration.RegistrantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RegistrantRepository registrantRepository;
    private final ExcelExportService excelExportService;

    /** Paginated list for an admin dashboard table. */
    @GetMapping("/registrants")
    public ResponseEntity<Page<Registrant>> listRegistrants(
            @RequestParam(required = false) RegistrantCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Registrant> result = category != null
                ? registrantRepository.findByCategory(category, pageable)
                : registrantRepository.findAll(pageable);

        return ResponseEntity.ok(result);
    }

    /**
     * Downloads all (optionally filtered) registrants as an .xlsx file.
     * Example: /api/admin/registrants/export?category=VOLUNTEER&from=2026-01-01&to=2026-06-24
     */
    @GetMapping("/registrants/export")
    public ResponseEntity<byte[]> exportRegistrants(
            @RequestParam(required = false) RegistrantCategory category,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        List<Registrant> registrants;

        LocalDateTime fromDate = from != null ? LocalDate.parse(from).atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
        LocalDateTime toDate = to != null ? LocalDate.parse(to).atTime(23, 59, 59) : LocalDateTime.now();

        if (category != null) {
            registrants = registrantRepository.findByCategoryAndCreatedAtBetween(category, fromDate, toDate);
        } else {
            registrants = registrantRepository.findByCreatedAtBetween(fromDate, toDate);
        }

        byte[] excelBytes = excelExportService.exportRegistrants(registrants);

        String filename = "afrilumina-registrants-" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
