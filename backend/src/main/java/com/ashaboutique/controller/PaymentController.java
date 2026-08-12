package com.ashaboutique.controller;

import com.ashaboutique.dto.PaymentInitializeRequest;
import com.ashaboutique.dto.PaymentInitializeResponse;
import com.ashaboutique.dto.PaymentVerifyRequest;
import com.ashaboutique.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initialize")
    public ResponseEntity<PaymentInitializeResponse> initializePayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PaymentInitializeRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            PaymentInitializeResponse response = paymentService.initializePayment(
                    userDetails.getUsername(),
                    request.orderId()
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            System.err.println("IllegalArgumentException in initializePayment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            System.err.println("Exception in initializePayment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PaymentVerifyRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            boolean success = paymentService.verifyPayment(
                    userDetails.getUsername(),
                    request
            );
            if (success) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Payment verification failed"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
