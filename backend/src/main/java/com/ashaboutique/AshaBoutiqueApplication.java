package com.ashaboutique;

import com.ashaboutique.model.Role;
import com.ashaboutique.model.User;
import com.ashaboutique.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class AshaBoutiqueApplication {

    public static void main(String[] args) {
        SpringApplication.run(AshaBoutiqueApplication.class, args);
    }

    @Bean
    public CommandLineRunner promoteAllUsersToAdmin(UserRepository userRepository) {
        return args -> {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if ("manishpawar172003@gmail.com".equalsIgnoreCase(user.getEmail()) || "admin@ashaboutique.com".equalsIgnoreCase(user.getEmail())) {
                    if (user.getRole() != Role.ADMIN) {
                        user.setRole(Role.ADMIN);
                        userRepository.save(user);
                        System.out.println("Ensured " + user.getEmail() + " is ADMIN");
                    }
                } else {
                    if (user.getRole() != Role.USER) {
                        user.setRole(Role.USER);
                        userRepository.save(user);
                        System.out.println("Demoted legacy admin " + user.getEmail() + " back to USER");
                    }
                }
            }
        };
    }
}
