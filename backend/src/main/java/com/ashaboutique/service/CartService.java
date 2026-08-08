package com.ashaboutique.service;

import com.ashaboutique.dto.CartItemResponse;
import com.ashaboutique.dto.CartResponse;
import com.ashaboutique.model.Cart;
import com.ashaboutique.model.CartItem;
import com.ashaboutique.model.Product;
import com.ashaboutique.model.User;
import com.ashaboutique.repository.CartItemRepository;
import com.ashaboutique.repository.CartRepository;
import com.ashaboutique.repository.ProductRepository;
import com.ashaboutique.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository, UserRepository userRepository,
                       ProductService productService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private Cart getOrCreateUserCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional(readOnly = true)
    public CartResponse getCartByUserEmail(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateUserCart(user);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(String email, Long productId, Integer quantity, String size) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateUserCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        String finalSize = size != null ? size : "S";

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId) && finalSize.equalsIgnoreCase(item.getSize()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity, finalSize);
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(String email, Long itemId, Integer quantity) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateUserCart(user);

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with id: " + itemId));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse removeItemFromCart(String email, Long itemId) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateUserCart(user);

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with id: " + itemId));

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateUserCart(user);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        productService.mapToResponse(item.getProduct()),
                        item.getQuantity(),
                        item.getSize()
                ))
                .collect(Collectors.toList());

        return new CartResponse(cart.getId(), itemResponses);
    }
}
