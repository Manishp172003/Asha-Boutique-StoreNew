package com.ashaboutique.service;

import com.ashaboutique.dto.TestimonialRequest;
import com.ashaboutique.dto.TestimonialResponse;
import com.ashaboutique.model.Testimonial;
import com.ashaboutique.repository.TestimonialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final NotificationService notificationService;

    public TestimonialService(TestimonialRepository testimonialRepository, NotificationService notificationService) {
        this.testimonialRepository = testimonialRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<TestimonialResponse> getApprovedTestimonials() {
        return testimonialRepository.findByApprovedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TestimonialResponse submitTestimonial(TestimonialRequest request) {
        String avatarUrl = request.avatarUrl() != null && !request.avatarUrl().isBlank() 
                ? request.avatarUrl() 
                : "/images/avatar1.jpg";

        Testimonial testimonial = new Testimonial(
                request.name(),
                request.quote(),
                request.rating(),
                avatarUrl,
                false // Submission defaults to unapproved
        );

        Testimonial savedTestimonial = testimonialRepository.save(testimonial);

        // Fire notification
        notificationService.createNotification(
            "New Review Submitted",
            savedTestimonial.getName() + " left a " + savedTestimonial.getRating() + "-star review: \"" + (savedTestimonial.getQuote().length() > 60 ? savedTestimonial.getQuote().substring(0, 60) + "..." : savedTestimonial.getQuote()) + "\"",
            "REVIEW",
            "/admin/reviews"
        );

        return mapToResponse(savedTestimonial);
    }

    @Transactional(readOnly = true)
    public List<TestimonialResponse> getAllTestimonialsAdmin() {
        return testimonialRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TestimonialResponse approveTestimonialAdmin(Long id, boolean approve) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found with id: " + id));

        testimonial.setApproved(approve);
        Testimonial updated = testimonialRepository.save(testimonial);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTestimonialAdmin(Long id) {
        if (!testimonialRepository.existsById(id)) {
            throw new IllegalArgumentException("Testimonial not found with id: " + id);
        }
        testimonialRepository.deleteById(id);
    }

    private TestimonialResponse mapToResponse(Testimonial testimonial) {
        return new TestimonialResponse(
                testimonial.getId(),
                testimonial.getName(),
                testimonial.getQuote(),
                testimonial.getRating(),
                testimonial.getAvatarUrl(),
                testimonial.getApproved(),
                testimonial.getCreatedAt()
        );
    }
}
