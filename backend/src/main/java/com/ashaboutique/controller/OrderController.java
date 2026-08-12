package com.ashaboutique.controller;

import com.ashaboutique.dto.OrderRequest;
import com.ashaboutique.dto.OrderResponse;
import com.ashaboutique.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        List<OrderResponse> orders = orderService.getUserOrders(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            OrderResponse order = orderService.getOrderById(userDetails.getUsername(), id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            OrderResponse order = orderService.createOrder(userDetails.getUsername(), request);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Admin endpoints (secured via SecurityConfig to role ADMIN)
    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrdersAdmin() {
        List<OrderResponse> orders = orderService.getAllOrdersAdmin();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            OrderResponse response = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/admin/orders/{id}/payment")
    public ResponseEntity<OrderResponse> updateOrderPaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String paymentStatus = body.get("paymentStatus");
        String paymentId = body.get("paymentId");
        if (paymentStatus == null || paymentStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            OrderResponse response = orderService.updateOrderPaymentStatus(id, paymentStatus, paymentId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
