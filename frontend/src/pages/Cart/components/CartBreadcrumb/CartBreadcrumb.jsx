import { Link } from "react-router-dom";
import "./CartBreadcrumb.css";

const CartBreadcrumb = () => {
  return (
    <div className="cart-breadcrumb">

      <Link to="/" className="breadcrumb-link">
        Home
      </Link>

      <span className="separator">›</span>

      <Link to="/shop" className="breadcrumb-link">
        Shop
      </Link>

      <span className="separator">›</span>

      <span className="current-page">
        Cart
      </span>

    </div>
  );
};

export default CartBreadcrumb;
