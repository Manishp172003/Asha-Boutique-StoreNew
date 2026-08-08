package com.ashaboutique.dto;

public record TestimonialRequest(
        String name,
        String quote,
        Integer rating,
        String avatarUrl
) {}
