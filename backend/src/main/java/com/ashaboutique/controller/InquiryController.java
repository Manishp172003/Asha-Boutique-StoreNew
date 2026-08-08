package com.ashaboutique.controller;

import com.ashaboutique.model.Inquiry;
import com.ashaboutique.service.InquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    // Public endpoint for submitting contact messages
    @PostMapping("/inquiries")
    public ResponseEntity<Inquiry> submitInquiry(@RequestBody Inquiry inquiry) {
        try {
            Inquiry saved = inquiryService.createInquiry(inquiry);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin endpoint to view inquiries
    @GetMapping("/admin/inquiries")
    public ResponseEntity<List<Inquiry>> getAllInquiries(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(inquiryService.getAllInquiriesAdmin());
    }

    // Admin endpoint to mark an inquiry as read
    @PutMapping("/admin/inquiries/{id}/read")
    public ResponseEntity<Inquiry> markAsRead(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Inquiry updated = inquiryService.markAsRead(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
