import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useApp } from "../../../../context/AppContext";
import { Button } from "@/components/ui/button";
import "./ProductInfo.css";

const colors = [
  "#E46A53",
  "#F4F0D8",
  "#FFFFFF",
  "#4D3728"
];

const sizes = ["XS", "S", "M", "L", "XL"];

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useApp();

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState("S");

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const wishlisted = isWishlisted(product.id);

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;

  return (

    <div className="product-info">

      <span className="collection-name">
        {product.category}
      </span>

      <h1>{product.name}</h1>

      <div className="product-rating">
        ★★★★★
        <span>({product.rating} reviews)</span>
      </div>

      <h2 className="product-price">{formattedPrice}</h2>

      <button
        className="wishlist-toggle-btn"
        onClick={handleWishlistToggle}
      >
        <Heart
          size={20}
          fill={wishlisted ? "#D57B5A" : "none"}
          color={wishlisted ? "#D57B5A" : "currentColor"}
        />
        {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </button>

      <p className="product-description">
        Handcrafted from the finest materials,
        designed for an effortless, elegant silhouette.
      </p>

      {/* Color */}
      <div className="option-group">
        <label>Color: Terracotta (Signature)</label>
      </div>

      {/* Size */}

      <div className="option-group">

        <div className="size-header">

          <label>Size</label>

          <button className="size-guide">
            Size Guide
          </button>

        </div>

        <div className="size-list">

          {sizes.map((size) => (

            <button
              key={size}
              className={`size-btn ${
                selectedSize === size ? "active" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>

          ))}

        </div>

      </div>

      <Button variant="primary" onClick={handleAddToCart} className="w-full mb-3">
        ADD TO CART
      </Button>

      <Button variant="primary" onClick={handleBuyNow} className="w-full">
        BUY IT NOW
      </Button>

      <div className="service-boxes">

        <div className="service-card">
          <h4>Fast Delivery</h4>
          <p>Arrives in 3â€“5 days</p>
        </div>

        <div className="service-card">
          <h4>Easy Returns</h4>
          <p>30-day free window</p>
        </div>

      </div>

    </div>

  );

};

export default ProductInfo;
