package com.ashaboutique.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAuth() {
        return ResponseEntity.ok(Map.of("message", "Authentication test successful. You are authorized!"));
    }
}
