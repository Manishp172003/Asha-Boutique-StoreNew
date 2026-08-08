package com.ashaboutique.service;

import com.ashaboutique.model.Coupon;
import com.ashaboutique.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
    }

    public Coupon createCoupon(Coupon coupon) {
        // Enforce upper case codes for clean standard layouts
        coupon.setCode(coupon.getCode().toUpperCase().trim());
        
        Optional<Coupon> existing = couponRepository.findByCodeIgnoreCase(coupon.getCode());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists");
        }
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new IllegalArgumentException("Coupon does not exist");
        }
        couponRepository.deleteById(id);
    }

    public Coupon validateCoupon(String code, Double cartTotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code"));

        if (!coupon.isActive()) {
            throw new IllegalArgumentException("This coupon code is no longer active");
        }

        // Validate expiry date if set
        if (coupon.getExpiryDate() != null && !coupon.getExpiryDate().isEmpty()) {
            try {
                LocalDate expiry = LocalDate.parse(coupon.getExpiryDate(), DateTimeFormatter.ISO_LOCAL_DATE);
                if (expiry.isBefore(LocalDate.now())) {
                    throw new IllegalArgumentException("This coupon has expired");
                }
            } catch (Exception e) {
                // If parsing fails, fall through or log
                if (e instanceof IllegalArgumentException) {
                    throw (IllegalArgumentException) e;
                }
            }
        }

        // Validate minimum cart amount
        if (cartTotal < coupon.getMinAmount()) {
            throw new IllegalArgumentException("Minimum order total of ₹" + coupon.getMinAmount().intValue() + " is required for this coupon");
        }

        return coupon;
    }
}
