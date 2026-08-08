package com.ashaboutique.dto;

import java.time.LocalDateTime;

public record TestimonialResponse(
        Long id,
        String name,
        String quote,
        Integer rating,
        String avatarUrl,
        Boolean approved,
        LocalDateTime createdAt
) {}
