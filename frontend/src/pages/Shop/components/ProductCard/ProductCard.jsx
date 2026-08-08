import "./ProductCard.css";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../context/AppContext";
import { Button } from "@/components/ui/button";
import LazyImage from "../../../../components/common/LazyImage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useApp();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/cart');
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="product-card" onClick={handleCardClick} role="button" tabIndex={0} aria-label={`View ${product.name} details`}>

      <div className="product-image-wrapper">

        <LazyImage
          src={product.imageUrl && product.imageUrl.includes(',') ? product.imageUrl.split(',')[0] : (product.imageUrl || '/images/product1.jpg')}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        {product.isNew && (
          <span className="badge new">NEW</span>
        )}

        {product.isSale && (
          <span className="badge sale">SALE</span>
        )}

        <button
          className="wishlist-btn"
          onClick={handleWishlistToggle}
        >
          <Heart
            size={18}
            fill={wishlisted ? "#D57B5A" : "none"}
            color={wishlisted ? "#D57B5A" : "currentColor"}
          />
        </button>

        <button
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          title="Quick View"
        >
          <Eye size={18} />
        </button>

      </div>

      <div className="product-details">

        <h3 className="product-name">{product.name}</h3>

        <div className="rating">

          <Star size={15} fill="#F4B400" color="#F4B400" />

          <span>{product.rating}</span>

        </div>

        <div className="product-details__footer">
          <div className="price">
            ₹ {product.price.toLocaleString('en-IN')}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart} title="Add to Cart">
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;