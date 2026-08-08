import "./Wishlist.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { animateWishlistPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { Button } from "@/components/ui/button";
import { ProductCardSkeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

import AccountLayout from "../../components/layout/AccountLayout";

import WishlistHeader from "./components/WishlistHeader/WishlistHeader";
import WishlistGrid from "./components/WishlistGrid/WishlistGrid";
import EditorialSection from "./components/EditorialSection/EditorialSection";



const Wishlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { wishlist, user, authLoading, cart, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();
  const navigate = useNavigate();

  const wishlistRef = useRef(null);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize animations after data loads
  useEffect(() => {
    if (!isLoading && wishlist && wishlist.length > 0) {
      const contexts = animateWishlistPage({ wishlistRef });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading, wishlist]);

  const isEmpty = wishlist.length === 0;

  return (
    <AccountLayout activeTab="wishlist">
      <div className="wishlist-content">
        <WishlistHeader count={wishlist.length} />

        {isEmpty ? (
          <EmptyState
            icon={Heart}
            title="Your Wishlist is Waiting"
            description="Save your favorite boutique pieces and revisit them anytime."
            buttonText="Continue Shopping"
            buttonRoute="/shop"
          />
        ) : (
          <>
            <div ref={wishlistRef}>
              <WishlistGrid />
            </div>
            <EditorialSection />
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default Wishlist;
