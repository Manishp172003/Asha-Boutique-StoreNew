package com.ashaboutique.dto;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        String name,
        String phone,
        String email,
        String serviceType,
        String preferredDate,
        String preferredTime,
        String notes,
        String status,
        LocalDateTime createdAt
) {}
