package com.ashaboutique.controller;

import com.ashaboutique.model.NewsletterSubscriber;
import com.ashaboutique.service.NewsletterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    // Public endpoint: Subscribe to newsletter
    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required"));
        }

        try {
            NewsletterSubscriber subscriber = newsletterService.subscribe(email);
            return ResponseEntity.ok(subscriber);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Admin endpoint: Get all subscribers
    @GetMapping("/admin/newsletter")
    public ResponseEntity<List<NewsletterSubscriber>> getAllSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }
}
