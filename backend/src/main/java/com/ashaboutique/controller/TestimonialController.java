package com.ashaboutique.controller;

import com.ashaboutique.dto.TestimonialRequest;
import com.ashaboutique.dto.TestimonialResponse;
import com.ashaboutique.service.TestimonialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TestimonialController {

    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    // Public endpoints
    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialResponse>> getApprovedTestimonials() {
        List<TestimonialResponse> testimonials = testimonialService.getApprovedTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @PostMapping("/testimonials")
    public ResponseEntity<TestimonialResponse> submitTestimonial(@RequestBody TestimonialRequest request) {
        TestimonialResponse response = testimonialService.submitTestimonial(request);
        return ResponseEntity.ok(response);
    }

    // Admin endpoints (secured via SecurityConfig to role ADMIN)
    @GetMapping("/admin/testimonials")
    public ResponseEntity<List<TestimonialResponse>> getAllTestimonialsAdmin() {
        List<TestimonialResponse> testimonials = testimonialService.getAllTestimonialsAdmin();
        return ResponseEntity.ok(testimonials);
    }

    @PutMapping("/admin/testimonials/{id}/approve")
    public ResponseEntity<TestimonialResponse> approveTestimonial(
            @PathVariable Long id,
            @RequestParam boolean approve
    ) {
        try {
            TestimonialResponse response = testimonialService.approveTestimonialAdmin(id, approve);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/admin/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        try {
            testimonialService.deleteTestimonialAdmin(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
