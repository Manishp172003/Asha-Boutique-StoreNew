package com.ashaboutique.service;

import com.ashaboutique.dto.ProductResponse;
import com.ashaboutique.model.Product;
import com.ashaboutique.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts(String category, String search) {
        List<Product> products;

        if (category != null && !category.isBlank()) {
            products = productRepository.findByCategory(category);
        } else if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductResponse request) {
        Product product = new Product(
                request.name(),
                request.description(),
                request.price(),
                request.imageUrl(),
                request.category(),
                request.rating(),
                request.isNew(),
                request.isSale(),
                request.fabric(),
                request.fit(),
                request.careInstructions(),
                request.deliveryInfo(),
                request.stockQuantity()
        );

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductResponse request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());
        product.setCategory(request.category());
        product.setRating(request.rating());
        product.setIsNew(request.isNew());
        product.setIsSale(request.isSale());
        product.setFabric(request.fabric());
        product.setFit(request.fit());
        product.setCareInstructions(request.careInstructions());
        product.setDeliveryInfo(request.deliveryInfo());
        product.setStockQuantity(request.stockQuantity());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory(),
                product.getRating(),
                product.getIsNew(),
                product.getIsSale(),
                product.getFabric(),
                product.getFit(),
                product.getCareInstructions(),
                product.getDeliveryInfo(),
                product.getStockQuantity()
        );
    }
}
