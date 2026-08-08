package com.ashaboutique.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String quote;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "avatar_url")
    private String avatarUrl = "/images/avatar1.jpg";

    @Column(nullable = false)
    private Boolean approved = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Testimonial() {}

    public Testimonial(String name, String quote, Integer rating, String avatarUrl, Boolean approved) {
        this.name = name;
        this.quote = quote;
        this.rating = rating;
        this.avatarUrl = avatarUrl;
        this.approved = approved;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
