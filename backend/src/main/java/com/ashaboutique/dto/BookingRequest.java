package com.ashaboutique.dto;

public record BookingRequest(
        String name,
        String phone,
        String email,
        String serviceType,
        String preferredDate,
        String preferredTime,
        String notes
) {}
