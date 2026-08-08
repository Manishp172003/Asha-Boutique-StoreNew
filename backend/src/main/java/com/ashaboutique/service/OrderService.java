package com.ashaboutique.service;

import com.ashaboutique.dto.OrderItemResponse;
import com.ashaboutique.dto.OrderRequest;
import com.ashaboutique.dto.OrderResponse;
import com.ashaboutique.model.*;
import com.ashaboutique.repository.CartRepository;
import com.ashaboutique.repository.OrderRepository;
import com.ashaboutique.repository.ProductRepository;
import com.ashaboutique.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final CartService cartService;
    private final NotificationService notificationService;
    private final CouponService couponService;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository,
                        UserRepository userRepository, ProductRepository productRepository,
                        ProductService productService, CartService cartService,
                        NotificationService notificationService, CouponService couponService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.cartService = cartService;
        this.notificationService = notificationService;
        this.couponService = couponService;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String email) {
        User user = getUserByEmail(email);
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String email, Long orderId) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        // Security check: Only the owner or an admin can access this order
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Unauthorized to view this order");
        }

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(String email, OrderRequest request) {
        User user = getUserByEmail(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("No cart found for user"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Calculate total price
        double subtotal = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        double discountAmount = 0.0;
        String couponCode = null;

        if (request.couponCode() != null && !request.couponCode().trim().isEmpty()) {
            Coupon coupon = couponService.validateCoupon(request.couponCode(), subtotal);
            couponCode = coupon.getCode();
            if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
                discountAmount = subtotal * (coupon.getDiscountValue() / 100.0);
            } else {
                discountAmount = coupon.getDiscountValue();
            }
            if (discountAmount > subtotal) {
                discountAmount = subtotal;
            }
        }

        double totalPrice = subtotal - discountAmount;
        Order order = new Order(user, request.shippingAddress(), totalPrice, couponCode, discountAmount);
        order.setOrderNumber(generateOrderNumber());

        // Convert cart items to order items and deduct stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            if (product.getStockQuantity() == 0) {
                notificationService.createNotification(
                    "Out of Stock Alert",
                    "Product '" + product.getName() + "' is now out of stock!",
                    "STOCK",
                    "/admin/products"
                );
            }

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getPrice(),
                    cartItem.getQuantity(),
                    cartItem.getSize()
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Fire notification
        notificationService.createNotification(
            "New Order Placed",
            user.getName() + " placed Order #" + savedOrder.getId() + " for ₹" + Math.round(savedOrder.getTotalPrice()),
            "ORDER",
            "/admin/orders"
        );

        // Clear the user's cart
        cartService.clearCart(email);

        return mapToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setStatus(status.toUpperCase());
        Order updated = orderRepository.save(updated = order);
        return mapToResponse(updated);
    }

    @Transactional
    public OrderResponse updateOrderPaymentStatus(Long orderId, String paymentStatus, String paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setPaymentStatus(paymentStatus.toUpperCase());
        if (paymentId != null) {
            order.setPaymentId(paymentId);
        }
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersAdmin() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        productService.mapToResponse(item.getProduct()),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSize()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getShippingAddress(),
                order.getTotalPrice(),
                order.getCouponCode(),
                order.getDiscountAmount(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getPaymentId(),
                itemResponses,
                order.getCreatedAt()
        );
    }

    private String generateOrderNumber() {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyMMdd");
        String dateStr = java.time.LocalDate.now().format(formatter);
        String randomHex = java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "AB-" + dateStr + "-" + randomHex;
    }
}
