import "./Breadcrumb.css";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <section className="shop-breadcrumb">
      <div className="breadcrumb-container">
        <Link to="/" className="breadcrumb-home">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Shop</span>
      </div>
    </section>
  );
};

export default Breadcrumb;