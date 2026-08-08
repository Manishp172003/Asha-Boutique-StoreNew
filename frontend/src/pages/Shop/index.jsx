import "./Shop.css";
import { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { animateShopPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { ProductCardSkeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { Search } from "lucide-react";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import HeroBanner from "./components/HeroBanner/HeroBanner";
import SearchSort from "./components/SearchSort/SearchSort";
import Sidebar from "./components/Sidebar/Sidebar";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import Pagination from "./components/Pagination/Pagination";
import Newsletter from "./components/Newsletter/Newsletter";

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

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

  // Local filtering logic
  const filteredProductsList = (productCatalog || []).filter(product => {
    // 1. Category Filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Sale') {
        if (!product.isSale) return false;
      } else {
        if (product.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
    }

    // 2. Price Filter
    if (product.price > maxPrice) return false;

    // 3. Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.category?.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    return true;
  });

  // Sort
  const sortedProductsList = [...filteredProductsList].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      return a.price - b.price;
    } else if (sortBy === 'Price: High to Low') {
      return b.price - a.price;
    } else if (sortBy === 'Name A-Z') {
      return a.name.localeCompare(b.name);
    } else {
      // Default: Newest
      return b.id - a.id;
    }
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  // Read search query parameter from URL on mount or location search change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || params.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const productsPerPage = 6;
  const totalProducts = sortedProductsList.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
  const paginatedProducts = sortedProductsList.slice(startIndex, startIndex + productsPerPage);

  const onClearFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(10000);
    setSearchQuery('');
    setSortBy('Newest');
  };

  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const productGridRef = useRef(null);
  const paginationRef = useRef(null);
  const newsletterRef = useRef(null);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleScrollToProducts = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleScrollToProducts();
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
      const contexts = animateShopPage({
        heroRef,
        containerRef,
        productGridRef,
        paginationRef,
        newsletterRef
      });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading]);

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <div className="shop-page">

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

      <HeroBanner ref={heroRef} onShopClick={handleScrollToProducts} />
      <SearchSort 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        startIndex={startIndex}
        endIndex={endIndex}
        totalProducts={totalProducts}
      />
      <section className="shop-products">
        <div ref={containerRef} className="shop-products-container">
          <Sidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onClearFilters={onClearFilters}
          />
          {isLoading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : sortedProductsList.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Products Found"
              description="Try another keyword or browse all collections."
              buttonText="View All Products"
              buttonRoute="/shop"
            />
          ) : (
            <ProductGrid products={paginatedProducts} />
          )}
        </div>
      </section>
      <div ref={paginationRef} className="pagination">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <div ref={newsletterRef} className="newsletter-wrapper">
        <Newsletter />
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

export default Shop;