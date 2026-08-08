import "./WishlistGrid.css";
import WishlistCard from "../WishlistCard/WishlistCard";
import { useApp } from "../../../../context/AppContext";

const WishlistGrid = () => {
  const { wishlist } = useApp();

  return (
    <section className="wishlist-grid">

      {wishlist.map((item) => (
        <WishlistCard
          key={item.id}
          product={item}
        />
      ))}

    </section>
  );
};

export default WishlistGrid;