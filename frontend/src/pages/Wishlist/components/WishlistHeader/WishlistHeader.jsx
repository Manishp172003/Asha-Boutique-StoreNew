import { Link } from "react-router-dom";
import "./WishlistHeader.css";

const WishlistHeader = ({ count }) => {
  return (
    <section className="wishlist-header">

      <div className="wishlist-title-row">

        <div>

          <h1>Saved Pieces</h1>

          <p>
            Refining your collection of intentional craftsmanship.
          </p>

        </div>

        <span className="wishlist-count">
          {count === 1 ? '1 Item' : `${count} Items`}
        </span>

      </div>

      <div className="wishlist-divider"></div>

    </section>
  );
};

export default WishlistHeader;