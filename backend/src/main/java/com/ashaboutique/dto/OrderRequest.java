package com.ashaboutique.dto;

public record OrderRequest(
        String shippingAddress,
        String couponCode
) {}
