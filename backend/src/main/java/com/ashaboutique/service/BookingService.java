package com.ashaboutique.service;

import com.ashaboutique.dto.BookingRequest;
import com.ashaboutique.dto.BookingResponse;
import com.ashaboutique.model.Booking;
import com.ashaboutique.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(String email) {
        return bookingRepository.findByEmailOrderByCreatedAtDesc(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = new Booking(
                request.name(),
                request.phone(),
                request.email(),
                request.serviceType(),
                request.preferredDate(),
                request.preferredTime(),
                request.notes()
        );

        Booking savedBooking = bookingRepository.save(booking);

        // Fire notification
        notificationService.createNotification(
            "New Appointment Booked",
            savedBooking.getName() + " requested " + savedBooking.getServiceType() + " for " + savedBooking.getPreferredDate(),
            "BOOKING",
            "/admin/appointments"
        );

        return mapToResponse(savedBooking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        booking.setStatus(status.toUpperCase());
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsAdmin() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getName(),
                booking.getPhone(),
                booking.getEmail(),
                booking.getServiceType(),
                booking.getPreferredDate(),
                booking.getPreferredTime(),
                booking.getNotes(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }
}
