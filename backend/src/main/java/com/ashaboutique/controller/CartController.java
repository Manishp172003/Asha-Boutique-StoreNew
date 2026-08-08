package com.ashaboutique.controller;

import com.ashaboutique.dto.CartItemRequest;
import com.ashaboutique.dto.CartResponse;
import com.ashaboutique.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        CartResponse response = cartService.getCartByUserEmail(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartItemRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        int quantity = request.quantity() != null ? request.quantity() : 1;
        CartResponse response = cartService.addItemToCart(
                userDetails.getUsername(),
                request.productId(),
                quantity,
                request.size()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CartResponse response = cartService.updateCartItemQuantity(userDetails.getUsername(), itemId, quantity);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CartResponse response = cartService.removeItemFromCart(userDetails.getUsername(), itemId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
