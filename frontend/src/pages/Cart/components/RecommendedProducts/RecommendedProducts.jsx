import "./RecommendedProducts.css";
import ProductCard from "../../../Shop/components/ProductCard/ProductCard";
import { products } from "../../../../data/products";
import { useApp } from "../../../../context/AppContext";

const RecommendedProducts = () => {
  const { cart = [] } = useApp();

  // Filter out products currently in the cart
  const cartIds = cart.map(item => item.id);
  const recommendedList = (products || [])
    .filter(p => !cartIds.includes(p.id))
    .slice(0, 4);

  // Fallback to first 4 products if too few recommendations
  const displayProducts = recommendedList.length >= 2
    ? recommendedList
    : (products || []).slice(0, 4);

  return (
    <section className="recommended-products">
      <div className="recommended-header">
        <p>You May Also Like</p>
        <h2>Curated For You</h2>
      </div>

      <div className="recommended-grid">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;