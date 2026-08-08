package com.ashaboutique.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    private String category;

    private Double rating = 5.0;

    @Column(name = "is_new")
    private Boolean isNew = false;

    @Column(name = "is_sale")
    private Boolean isSale = false;

    private String fabric;

    private String fit;

    @Column(name = "care_instructions")
    private String careInstructions;

    @Column(name = "delivery_info")
    private String deliveryInfo;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    public Product() {}

    public Product(String name, String description, Double price, String imageUrl, String category, Double rating, Boolean isNew, Boolean isSale, String fabric, String fit, String careInstructions, String deliveryInfo, Integer stockQuantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.rating = rating;
        this.isNew = isNew;
        this.isSale = isSale;
        this.fabric = fabric;
        this.fit = fit;
        this.careInstructions = careInstructions;
        this.deliveryInfo = deliveryInfo;
        this.stockQuantity = stockQuantity;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getIsSale() { return isSale; }
    public void setIsSale(Boolean isSale) { this.isSale = isSale; }

    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }

    public String getFit() { return fit; }
    public void setFit(String fit) { this.fit = fit; }

    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }

    public String getDeliveryInfo() { return deliveryInfo; }
    public void setDeliveryInfo(String deliveryInfo) { this.deliveryInfo = deliveryInfo; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
