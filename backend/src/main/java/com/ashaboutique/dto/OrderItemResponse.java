package com.ashaboutique.dto;

public record OrderItemResponse(
        Long id,
        ProductResponse product,
        Double price,
        Integer quantity,
        String size
) {}
