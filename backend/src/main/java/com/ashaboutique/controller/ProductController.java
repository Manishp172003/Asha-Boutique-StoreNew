package com.ashaboutique.controller;

import com.ashaboutique.dto.ProductResponse;
import com.ashaboutique.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Public endpoints
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<ProductResponse> products = productService.getAllProducts(category, search);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin endpoints (secured via SecurityConfig to role ADMIN)
    @PostMapping("/admin/products")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductResponse request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductResponse request
    ) {
        try {
            ProductResponse response = productService.updateProduct(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/products/upload")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") org.springframework.web.multipart.MultipartFile[] files) {
        List<String> urls = new java.util.ArrayList<>();
        try {
            java.io.File uploadDir = new java.io.File("src/main/resources/static/uploads").getAbsoluteFile();
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            for (org.springframework.web.multipart.MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null) {
                    return ResponseEntity.badRequest().build();
                }
                String lowerName = originalFilename.toLowerCase();
                if (!lowerName.endsWith(".jpg") && !lowerName.endsWith(".jpeg") && !lowerName.endsWith(".png")) {
                    return ResponseEntity.badRequest().build();
                }
                
                String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
                String filename = java.util.UUID.randomUUID().toString() + ext;
                java.io.File dest = new java.io.File(uploadDir, filename);
                file.transferTo(dest);
                
                urls.add("/uploads/" + filename);
            }
            return ResponseEntity.ok(urls);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
