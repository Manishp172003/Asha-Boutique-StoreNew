package com.ashaboutique.repository;

import com.ashaboutique.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {
    Optional<NewsletterSubscriber> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
