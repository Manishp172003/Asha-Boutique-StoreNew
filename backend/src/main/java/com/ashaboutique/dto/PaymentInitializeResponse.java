package com.ashaboutique.dto;

public record PaymentInitializeResponse(
        boolean isMock,
        String razorpayOrderId,
        String razorpayKeyId,
        Double amount,
        String currency,
        String orderNumber,
        String upiId
) {}
