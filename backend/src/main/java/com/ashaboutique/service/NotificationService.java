package com.ashaboutique.service;

import com.ashaboutique.model.Notification;
import com.ashaboutique.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(String title, String message, String type, String link) {
        Notification notification = new Notification(title, message, type, link);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getAllNotificationsAdmin() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findAll().stream()
                .filter(n -> !n.isRead())
                .toList();
        for (Notification notification : unread) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}
