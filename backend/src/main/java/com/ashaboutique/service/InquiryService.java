package com.ashaboutique.service;

import com.ashaboutique.model.Inquiry;
import com.ashaboutique.repository.InquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final NotificationService notificationService;

    public InquiryService(InquiryRepository inquiryRepository, NotificationService notificationService) {
        this.inquiryRepository = inquiryRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Inquiry createInquiry(Inquiry inquiry) {
        Inquiry saved = inquiryRepository.save(inquiry);
        
        // Also fire a system notification trigger
        notificationService.createNotification(
            "New Message Inquiry",
            "Customer " + inquiry.getName() + " sent an inquiry regarding: " + (inquiry.getSubject() != null ? inquiry.getSubject() : "Custom tailoring"),
            "MESSAGE",
            "/admin/help" // redirect to Help/Support Center
        );
        
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Inquiry> getAllInquiriesAdmin() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Inquiry markAsRead(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found with id: " + id));
        inquiry.setRead(true);
        return inquiryRepository.save(inquiry);
    }
}
