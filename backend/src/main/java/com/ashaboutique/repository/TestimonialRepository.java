package com.ashaboutique.repository;

import com.ashaboutique.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByApprovedTrueOrderByCreatedAtDesc();
}
