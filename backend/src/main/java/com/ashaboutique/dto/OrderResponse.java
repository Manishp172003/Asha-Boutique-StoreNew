package com.ashaboutique.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String shippingAddress,
        Double totalPrice,
        String couponCode,
        Double discountAmount,
        String status,
        String paymentStatus,
        String paymentId,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {}
