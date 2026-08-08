package com.ashaboutique.config;

import com.ashaboutique.model.Product;
import com.ashaboutique.model.Role;
import com.ashaboutique.model.Testimonial;
import com.ashaboutique.model.User;
import com.ashaboutique.repository.ProductRepository;
import com.ashaboutique.repository.TestimonialRepository;
import com.ashaboutique.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final TestimonialRepository testimonialRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DataSeeder(ProductRepository productRepository, TestimonialRepository testimonialRepository,
                      UserRepository userRepository, PasswordEncoder passwordEncoder,
                      org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.productRepository = productRepository;
        this.testimonialRepository = testimonialRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE products MODIFY COLUMN image_url TEXT");
            System.out.println("Altered products image_url column to TEXT successfully");
            
            try {
                jdbcTemplate.execute("ALTER TABLE cart_items ADD COLUMN size VARCHAR(50) DEFAULT 'S'");
                System.out.println("Added size column to cart_items successfully");
            } catch (Exception e) {
                // Column already exists
            }

            try {
                jdbcTemplate.execute("ALTER TABLE order_items ADD COLUMN size VARCHAR(50) DEFAULT 'S'");
                System.out.println("Added size column to order_items successfully");
            } catch (Exception e) {
                // Column already exists
            }

            try {
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN order_number VARCHAR(100) UNIQUE");
                System.out.println("Added order_number column to orders successfully");
            } catch (Exception e) {
                // Column already exists
            }

            try {
                List<Long> orderIdsWithoutNumber = jdbcTemplate.queryForList(
                    "SELECT id FROM orders WHERE order_number IS NULL", Long.class);
                for (Long id : orderIdsWithoutNumber) {
                    String randomHex = java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase();
                    String generated = "AB-260807-OLD" + id + "-" + randomHex;
                    jdbcTemplate.update("UPDATE orders SET order_number = ? WHERE id = ?", generated, id);
                    System.out.println("Backfilled Order #" + id + " with order number " + generated);
                }
            } catch (Exception e) {
                System.err.println("Could not backfill orders: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Could not run startup database updates: " + e.getMessage());
        }
        seedAdminUser();
        seedProducts();
        seedTestimonials();
        seedCoupons();
    }

    private void seedCoupons() {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM coupons", Integer.class);
            if (count == null || count == 0) {
                jdbcTemplate.execute("INSERT INTO coupons (code, discount_type, discount_value, min_amount, active) VALUES ('ASHA10', 'PERCENTAGE', 10.0, 1000.0, 1)");
                jdbcTemplate.execute("INSERT INTO coupons (code, discount_type, discount_value, min_amount, active) VALUES ('FESTIVE500', 'FIXED', 500.0, 3000.0, 1)");
                jdbcTemplate.execute("INSERT INTO coupons (code, discount_type, discount_value, min_amount, active) VALUES ('WELCOME20', 'PERCENTAGE', 20.0, 1500.0, 1)");
                System.out.println("Seeded default coupons successfully");
            }
        } catch (Exception e) {
            System.err.println("Could not seed coupons: " + e.getMessage());
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@ashaboutique.com")) {
            User admin = new User(
                    "Boutique Admin",
                    "admin@ashaboutique.com",
                    passwordEncoder.encode("admin@1234"),
                    "9876543210",
                    Role.ADMIN
            );
            userRepository.save(admin);
        }
    }

    private void seedProducts() {
        if (productRepository.count() != 8) {
            // Reset tables to clear old jewelry products safely
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
            jdbcTemplate.execute("TRUNCATE TABLE cart_items");
            jdbcTemplate.execute("TRUNCATE TABLE order_items");
            jdbcTemplate.execute("TRUNCATE TABLE orders");
            jdbcTemplate.execute("TRUNCATE TABLE products");
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");

            List<Product> mockProducts = List.of(
                new Product(
                        "Pleat-Front Blouse",
                        "A refined blouse with soft pleat detailing, tailored for easy movement and a polished everyday shape.",
                        2400.0,
                        "/images/product9.png",
                        "Tops",
                        4.7,
                        true,
                        false,
                        "Cotton-silk blend",
                        "Relaxed shoulder with a neat waist",
                        "Gentle hand wash or dry clean",
                        "Ready to ship in 2-3 days",
                        20
                ),
                new Product(
                        "Tiered Midi Dress",
                        "A graceful midi dress with tiered movement, finished with a flattering neckline and fluid drape.",
                        3800.0,
                        "/images/product10.png",
                        "Dresses",
                        4.8,
                        true,
                        false,
                        "Soft rayon voile",
                        "Easy fit with a defined waist",
                        "Cold wash separately",
                        "Ready to ship in 3-4 days",
                        16
                ),
                new Product(
                        "Tailored Trousers",
                        "Structured trousers finished for everyday comfort, with a clean front and ankle-skimming length.",
                        2900.0,
                        "/images/product11.png",
                        "Tailoring",
                        4.6,
                        false,
                        true,
                        "Cotton twill",
                        "High-rise straight fit",
                        "Machine wash mild",
                        "Ready to ship in 4-5 days",
                        18
                ),
                new Product(
                        "Cropped Linen Jacket",
                        "A light cropped jacket in breathable linen, ideal for layering over dresses, kurtas, and camisoles.",
                        3200.0,
                        "/images/product12.png",
                        "Tops",
                        4.9,
                        true,
                        false,
                        "Washed linen",
                        "Boxy cropped fit",
                        "Dry clean recommended",
                        "Ready to ship in 3-4 days",
                        14
                ),
                new Product(
                        "Handloom Kurta Set",
                        "A handloom kurta set with boutique finishing, balanced for festive days and relaxed evenings.",
                        4100.0,
                        "/images/product13.png",
                        "Dresses",
                        4.8,
                        false,
                        true,
                        "Handloom cotton",
                        "Straight kurta with easy trousers",
                        "Hand wash in cold water",
                        "Ready to ship in 5-7 days",
                        12
                ),
                new Product(
                        "Silk Scarf",
                        "A soft silk scarf for effortless layering, adding a quiet accent to workwear and occasion looks.",
                        1200.0,
                        "/images/product14.png",
                        "Accessories",
                        4.5,
                        true,
                        false,
                        "Silk blend",
                        "One size",
                        "Dry clean only",
                        "Ready to ship in 1-2 days",
                        25
                ),
                new Product(
                        "Embroidered Tote",
                        "A carry-all tote with embroidered detailing, sized for daily errands, books, and boutique finds.",
                        1800.0,
                        "/images/product7.jpg",
                        "Accessories",
                        4.7,
                        false,
                        false,
                        "Canvas with thread embroidery",
                        "Spacious interior pocket",
                        "Spot clean gently",
                        "Ready to ship in 2-3 days",
                        22
                ),
                new Product(
                        "Block-Print Dupatta",
                        "A block-print dupatta with a light drape, made to pair with classic kurtas and simple dresses.",
                        1500.0,
                        "/images/product8.jpg",
                        "Accessories",
                        4.6,
                        true,
                        false,
                        "Mul cotton",
                        "Full-length drape",
                        "Cold wash separately",
                        "Ready to ship in 2-3 days",
                        24
                )
            );
            productRepository.saveAll(mockProducts);
        }
    }

    private void seedTestimonials() {
        if (testimonialRepository.count() == 0) {
            List<Testimonial> mockTestimonials = List.of(
                new Testimonial("Priya D.", "They altered my mother's saree blouse in a day. Perfect fit.", 5, "/images/avatar1.jpg", true),
                new Testimonial("Ananya R.", "I walked in nervous about tailoring. Walked out with three outfits planned.", 5, "/images/avatar2.jpg", true),
                new Testimonial("Meera S.", "The details are thoughtful—pockets that sit right, hems that hold.", 5, "/images/avatar3.jpg", true)
            );
            testimonialRepository.saveAll(mockTestimonials);
        }
    }
}
