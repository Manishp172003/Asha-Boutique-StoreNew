package com.ashaboutique.dto;

public record CartItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        String size
) {}
