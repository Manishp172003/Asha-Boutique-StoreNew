package com.ashaboutique.service;

import com.ashaboutique.config.JwtService;
import com.ashaboutique.dto.AuthRequest;
import com.ashaboutique.dto.AuthResponse;
import com.ashaboutique.dto.RegisterRequest;
import com.ashaboutique.dto.UserDto;
import com.ashaboutique.model.Cart;
import com.ashaboutique.model.Role;
import com.ashaboutique.model.User;
import com.ashaboutique.repository.CartRepository;
import com.ashaboutique.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, CartRepository cartRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // Check if there are no users in database - if so, make first user an ADMIN!
        Role role = Role.USER;
        if (userRepository.count() == 0 || "manishpawar172003@gmail.com".equalsIgnoreCase(request.email())) {
            role = Role.ADMIN;
        }

        User user = new User(
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.phone(),
                role
        );

        User savedUser = userRepository.save(user);

        // Auto-create active shopping cart for user
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        String jwtToken = jwtService.generateToken(savedUser);
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getPhone(), savedUser.getRole(), savedUser.isBlocked());

        return new AuthResponse(jwtToken, userDto);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.email()));

        String jwtToken = jwtService.generateToken(user);
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.isBlocked());

        return new AuthResponse(jwtToken, userDto);
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.isBlocked());
    }

    @Transactional
    public AuthResponse googleLogin(String googleIdTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList("116347018906-6se17i8o2484b8t599jgs0q60qn8ljf5.apps.googleusercontent.com"))
                .build();

        GoogleIdToken idToken = verifier.verify(googleIdTokenString);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                Role role = Role.USER;
                if (userRepository.count() == 0 || "manishpawar172003@gmail.com".equalsIgnoreCase(email)) {
                    role = Role.ADMIN;
                }
                User newUser = new User(
                        name != null ? name : email.split("@")[0],
                        email,
                        passwordEncoder.encode(java.util.UUID.randomUUID().toString()),
                        "",
                        role
                );
                User saved = userRepository.save(newUser);

                Cart cart = new Cart(saved);
                cartRepository.save(cart);

                return saved;
            });

            if ("manishpawar172003@gmail.com".equalsIgnoreCase(user.getEmail()) && user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                user = userRepository.save(user);
            }

            String jwtToken = jwtService.generateToken(user);
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.isBlocked());

            return new AuthResponse(jwtToken, userDto);
        } else {
            throw new IllegalArgumentException("Invalid Google ID Token");
        }
    }

    @Transactional
    public UserDto updateUserProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        user.setName(userDto.name());
        user.setPhone(userDto.phone());

        User savedUser = userRepository.save(user);
        return new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getPhone(), savedUser.getRole(), savedUser.isBlocked());
    }

    @Transactional(readOnly = true)
    public java.util.List<UserDto> getAllUsersAdmin() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.isBlocked()))
                .toList();
    }

    @Transactional
    public void deleteUserAdmin(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDto toggleUserBlockAdmin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setBlocked(!user.isBlocked());
        User saved = userRepository.save(user);
        return new UserDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhone(), saved.getRole(), saved.isBlocked());
    }

    @Transactional
    public UserDto updateUserRoleAdmin(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setRole(role);
        User saved = userRepository.save(user);
        return new UserDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhone(), saved.getRole(), saved.isBlocked());
    }

    @Transactional
    public String generateResetPasswordToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        System.out.println("==========================================================================");
        System.out.println("PASSWORD RESET LINK: http://localhost:5173/reset-password?token=" + token);
        System.out.println("==========================================================================");

        return token;
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));
        
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }
}
