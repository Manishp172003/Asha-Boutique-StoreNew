import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./Product.css";
import { useApp } from "../../context/AppContext";
import { animateProductPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { ProductDetailsSkeleton } from "../../components/Skeleton";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import ProductBreadcrumb from "./components/ProductBreadcrumb/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery/ProductGallery";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import DescriptionTabs from "./components/DescriptionTabs/DescriptionTabs";
import RelatedProducts from "./components/RelatedProducts/RelatedProducts";
import RecentlyViewed from "./components/RecentlyViewed/RecentlyViewed";

import { products } from "../../data/products";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    cart,
    mobileMenuOpen,
    setCartOpen,
    setBookingOpen,
    setMobileMenuOpen,
    handleLogout,
    productCatalog,
  } = useApp();

  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const tabsRef = useRef(null);
  const relatedRef = useRef(null);
  const recentlyRef = useRef(null);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize animations after data loads
  useEffect(() => {
    if (!isLoading) {
      const contexts = animateProductPage({
        galleryRef,
        infoRef,
        tabsRef,
        relatedRef,
        recentlyRef
      });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading]);

  const activeCatalog = productCatalog && productCatalog.length > 0 ? productCatalog : products;
  const product = activeCatalog.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (!isLoading && !product) {
      navigate("/shop");
    }
  }, [product, navigate, isLoading]);

  if (!product) {
    return null;
  }

  return (
    <div className="product-page">

      <Navigation
        user={user}
        cart={cart}
        onCartOpen={handleCartOpen}
        onLogout={handleLogout}
        onBookingOpen={handleBookingOpen}
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      <ProductBreadcrumb productName={product.name} />

      <section className="product-top">
        <div ref={galleryRef} className="product-gallery">
          <ProductGallery product={product} />
        </div>
        <div ref={infoRef} className="product-info">
          <ProductInfo product={product} />
        </div>
      </section>

      <div ref={tabsRef} className="description-tabs">
        <DescriptionTabs product={product} />
      </div>

      <div ref={relatedRef}>
        <RelatedProducts currentProductId={product.id} />
      </div>

      <div ref={recentlyRef}>
        <RecentlyViewed currentProductId={product.id} />
      </div>

      <Footer
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        onBookingOpen={handleBookingOpen}
      />

    </div>
  );
};

export default Product;