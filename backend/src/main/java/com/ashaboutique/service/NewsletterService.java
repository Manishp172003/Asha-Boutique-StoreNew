package com.ashaboutique.service;

import com.ashaboutique.model.Coupon;
import com.ashaboutique.model.NewsletterSubscriber;
import com.ashaboutique.repository.CouponRepository;
import com.ashaboutique.repository.NewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Transactional
    public NewsletterSubscriber subscribe(String email) {
        String cleanEmail = email.trim().toLowerCase();
        
        if (newsletterRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("This email is already subscribed to our community newsletter.");
        }

        // Auto-create WELCOME10 coupon code if it doesn't exist
        Optional<Coupon> existingCoupon = couponRepository.findByCodeIgnoreCase("WELCOME10");
        if (existingCoupon.isEmpty()) {
            Coupon welcomeCoupon = new Coupon(
                    "WELCOME10",
                    "PERCENTAGE",
                    10.0,
                    500.0,
                    null, // No expiry
                    true
            );
            couponRepository.save(welcomeCoupon);
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber(cleanEmail);
        return newsletterRepository.save(subscriber);
    }

    public List<NewsletterSubscriber> getAllSubscribers() {
        return newsletterRepository.findAll();
    }
}
