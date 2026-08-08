import { Link } from "react-router-dom";
import "./ProductBreadcrumb.css";

const ProductBreadcrumb = ({ productName }) => {
  return (
    <div className="product-breadcrumb">

      <Link to="/" className="breadcrumb-link">
        Home
      </Link>

      <span className="separator">›</span>

      <Link to="/shop" className="breadcrumb-link">
        Shop
      </Link>

      <span className="separator">›</span>

      <span className="current-page">
        {productName}
      </span>

    </div>
  );
};

export default ProductBreadcrumb;