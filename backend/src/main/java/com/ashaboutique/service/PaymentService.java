package com.ashaboutique.service;

import com.ashaboutique.dto.PaymentInitializeResponse;
import com.ashaboutique.dto.PaymentVerifyRequest;
import com.ashaboutique.model.Order;
import com.ashaboutique.model.User;
import com.ashaboutique.repository.OrderRepository;
import com.ashaboutique.repository.UserRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${razorpay.key.id:}")
    private String keyId;

    @Value("${razorpay.key.secret:}")
    private String keySecret;

    @Value("${demo.upi.id:ashaboutique@okaxis}")
    private String demoUpiId;

    public PaymentService(OrderRepository orderRepository, UserRepository userRepository, NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public PaymentInitializeResponse initializePayment(String email, Long orderId) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to pay for this order");
        }

        // Check if Razorpay keys are configured
        if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
            return new PaymentInitializeResponse(
                    true,
                    "",
                    "",
                    order.getTotalPrice(),
                    "INR",
                    order.getOrderNumber(),
                    demoUpiId
            );
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            // Convert to Paisa (amount * 100)
            int amountInPaisa = (int) Math.round(order.getTotalPrice() * 100);
            orderRequest.put("amount", amountInPaisa);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber() != null ? order.getOrderNumber() : order.getId().toString());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Save Razorpay order ID to order entity
            order.setPaymentId(razorpayOrderId);
            orderRepository.save(order);

            return new PaymentInitializeResponse(
                    false,
                    razorpayOrderId,
                    keyId,
                    order.getTotalPrice(),
                    "INR",
                    order.getOrderNumber(),
                    demoUpiId
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Razorpay payment order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean verifyPayment(String email, PaymentVerifyRequest request) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + request.orderId()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized transaction verification");
        }

        if (request.isMock()) {
            order.setPaymentStatus("PAID");
            order.setStatus("CONFIRMED");
            order.setPaymentId("MOCK-PAY-" + System.currentTimeMillis());
            orderRepository.save(order);
            
            notificationService.createNotification(
                "Payment Success",
                user.getName() + " completed payment of ₹" + order.getTotalPrice() + " for order #" + (order.getOrderNumber() != null ? order.getOrderNumber() : order.getId()),
                "PAYMENT",
                "/orders"
            );
            return true;
        }

        // Verify Razorpay signature
        try {
            String payload = request.razorpayOrderId() + "|" + request.razorpayPaymentId();
            String calculatedSignature = calculateHmacSha256(payload, keySecret);

            if (calculatedSignature.equals(request.razorpaySignature())) {
                order.setPaymentStatus("PAID");
                order.setStatus("CONFIRMED");
                order.setPaymentId(request.razorpayPaymentId());
                orderRepository.save(order);

                notificationService.createNotification(
                    "Payment Success",
                    user.getName() + " completed payment of ₹" + order.getTotalPrice() + " for order #" + (order.getOrderNumber() != null ? order.getOrderNumber() : order.getId()),
                    "PAYMENT",
                    "/orders"
                );
                return true;
            } else {
                order.setPaymentStatus("FAILED");
                orderRepository.save(order);
                return false;
            }
        } catch (Exception e) {
            throw new RuntimeException("Payment signature verification failed: " + e.getMessage(), e);
        }
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawMac = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : rawMac) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
