package com.ashaboutique.dto;

public record ProductResponse(
        Long id,
        String name,
        String description,
        Double price,
        String imageUrl,
        String category,
        Double rating,
        Boolean isNew,
        Boolean isSale,
        String fabric,
        String fit,
        String careInstructions,
        String deliveryInfo,
        Integer stockQuantity
) {}
