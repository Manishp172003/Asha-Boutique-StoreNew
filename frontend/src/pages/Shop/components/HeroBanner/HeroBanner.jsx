import { forwardRef } from "react";
import { Link } from "react-router-dom";
import LazyImage from "../../../../components/common/LazyImage";
import "./HeroBanner.css";

const HeroBanner = forwardRef(({ onShopClick }, ref) => {
  return (
    <section ref={ref} className="shop-hero">
      <LazyImage
        src="/images/shop-hero.png"
        alt="Linen Collection"
        loading="eager"
      />

      {/* Breadcrumb Overlay */}
      <div className="shop-hero-breadcrumb">
        <Link to="/" className="hero-breadcrumb-link">Home</Link>
        <span className="hero-breadcrumb-separator">/</span>
        <span className="hero-breadcrumb-current">Shop</span>
      </div>

      <div className="shop-hero-overlay">
        <h1 className="shop-hero-title">
          Explore Our Collection
        </h1>
        <p className="shop-hero-subtitle">
          Minimalist linen garments, curated slow craft textiles, and timeless silhouettes.
        </p>
      </div>
    </section>
  );
});

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;