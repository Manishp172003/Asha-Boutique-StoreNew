package com.ashaboutique.controller;

import com.ashaboutique.model.Coupon;
import com.ashaboutique.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CouponController {

    @Autowired
    private CouponService couponService;

    // Public validation endpoint
    @GetMapping("/coupons/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam Double total) {
        try {
            Coupon coupon = couponService.validateCoupon(code, total);
            return ResponseEntity.ok(coupon);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Public active coupons endpoint for suggestions
    @GetMapping("/coupons/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        List<Coupon> activeCoupons = couponService.getAllCoupons().stream()
                .filter(Coupon::isActive)
                .toList();
        return ResponseEntity.ok(activeCoupons);
    }

    // Admin endpoint: List all coupons
    @GetMapping("/admin/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // Admin endpoint: Create coupon
    @PostMapping("/admin/coupons")
    public ResponseEntity<?> createCoupon(@RequestBody Coupon coupon) {
        try {
            Coupon created = couponService.createCoupon(coupon);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Admin endpoint: Delete coupon
    @DeleteMapping("/admin/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(Map.of("message", "Coupon deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
