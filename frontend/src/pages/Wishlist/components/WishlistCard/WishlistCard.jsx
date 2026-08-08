import { Heart } from "lucide-react";
import { useApp } from "../../../../context/AppContext";
import LazyImage from "../../../../components/common/LazyImage";
import "./WishlistCard.css";

const WishlistCard = ({ product }) => {
  const { removeFromWishlist } = useApp();

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
  };

  return (
    <article className="wishlist-card">

      <div className="wishlist-image">

        <LazyImage
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
        />

        <button 
          className="wishlist-heart" 
          onClick={handleRemove}
          aria-label="Remove from wishlist"
        >

          <Heart
            size={18}
            fill="#D57B5A"
            color="#D57B5A"
          />

        </button>

      </div>

      <div className="wishlist-info">

        <span>{product.category}</span>

        <div className="wishlist-row">

          <h3>{product.name}</h3>

          <p>₹{product.price.toLocaleString("en-IN")}</p>

        </div>

      </div>

    </article>
  );
};

export default WishlistCard;