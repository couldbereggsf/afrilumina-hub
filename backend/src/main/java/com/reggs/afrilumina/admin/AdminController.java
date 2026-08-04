package com.reggs.afrilumina.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reggs.afrilumina.registration.Registration;
import com.reggs.afrilumina.registration.RegistrationCategory;
import com.reggs.afrilumina.registration.RegistrationRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RegistrationRepository registrationRepository;
    private final ExcelExportService excelExportService;

    /** Paginated list for an admin dashboard table. */
    @GetMapping("/registrations")
    public ResponseEntity<Page<Registration>> listRegistrations(
            @RequestParam(required = false) RegistrationCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Registration> result = category != null
                ? registrationRepository.findByCategory(category, pageable)
                : registrationRepository.findAll(pageable);

        return ResponseEntity.ok(result);
    }

    /**
     * Downloads all (optionally filtered) registrations as an .xlsx file.
     * Example: /api/admin/registrations/export?category=VOLUNTEER&from=2026-01-01&to=2026-06-24
     */
    @GetMapping("/registrations/export")
    public ResponseEntity<byte[]> exportRegistrations(
            @RequestParam(required = false) RegistrationCategory category,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        List<Registration> registrations;

        LocalDateTime fromDate = from != null ? LocalDate.parse(from).atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
        LocalDateTime toDate = to != null ? LocalDate.parse(to).atTime(23, 59, 59) : LocalDateTime.now();

        if (category != null) {
            registrations = registrationRepository.findByCategoryAndCreatedAtBetween(category, fromDate, toDate);
        } else {
            registrations = registrationRepository.findByCreatedAtBetween(fromDate, toDate);
        }

        byte[] excelBytes = excelExportService.exportRegistrations(registrations);

        String filename = "afrilumina-registrations-" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
