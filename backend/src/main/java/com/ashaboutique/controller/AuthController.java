package com.ashaboutique.controller;

import com.ashaboutique.dto.AuthRequest;
import com.ashaboutique.dto.AuthResponse;
import com.ashaboutique.dto.GoogleAuthRequest;
import com.ashaboutique.dto.RegisterRequest;
import com.ashaboutique.dto.UserDto;
import com.ashaboutique.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = authService.googleLogin(request.idToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto profile = authService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDto userDto
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            UserDto updated = authService.updateUserProfile(userDetails.getUsername(), userDto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/users")
    public ResponseEntity<java.util.List<UserDto>> getAllUsersAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto currentUser = authService.getUserProfile(userDetails.getUsername());
        if (currentUser.role() != com.ashaboutique.model.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        java.util.List<UserDto> users = authService.getAllUsersAdmin();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUserAdmin(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto currentUser = authService.getUserProfile(userDetails.getUsername());
        if (currentUser.role() != com.ashaboutique.model.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        try {
            authService.deleteUserAdmin(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/admin/users/{id}/block")
    public ResponseEntity<UserDto> toggleUserBlockAdmin(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto currentUser = authService.getUserProfile(userDetails.getUsername());
        if (currentUser.role() != com.ashaboutique.model.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        try {
            UserDto response = authService.toggleUserBlockAdmin(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateUserRoleAdmin(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Strict Superadmin Check
        if (!"manishpawar172003@gmail.com".equalsIgnoreCase(userDetails.getUsername())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only the primary administrator (manishpawar172003@gmail.com) can manage role access."));
        }

        String roleStr = body.get("role");
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role is required"));
        }

        try {
            com.ashaboutique.model.Role role = com.ashaboutique.model.Role.valueOf(roleStr.toUpperCase());
            UserDto response = authService.updateUserRoleAdmin(id, role);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role specified"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
