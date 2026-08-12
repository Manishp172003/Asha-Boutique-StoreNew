package com.ashaboutique.dto;

public record PaymentVerifyRequest(
        Long orderId,
        String razorpayPaymentId,
        String razorpayOrderId,
        String razorpaySignature,
        boolean isMock
) {}
