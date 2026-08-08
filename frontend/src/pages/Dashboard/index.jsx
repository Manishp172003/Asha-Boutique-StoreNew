import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { DashboardSkeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

import AccountLayout from "../../components/layout/AccountLayout";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import StatisticsCards from "./components/StatisticsCards/StatisticsCards";
import RecentOrder from "./components/RecentOrder/RecentOrder";
import WishlistPreview from "./components/WishlistPreview/WishlistPreview";
import QuickActions from "./components/QuickActions/QuickActions";
import CollectionBanner from "./components/CollectionBanner/CollectionBanner";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    authLoading,
    orders,
    wishlist,
    addresses,
    cart,
    mobileMenuOpen,
    setCartOpen,
    setBookingOpen,
    setMobileMenuOpen,
    handleLogout,
  } = useApp();

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const welcomeRef = useRef(null);
  const statsRef = useRef(null);
  const recentOrderRef = useRef(null);
  const wishlistRef = useRef(null);
  const quickActionsRef = useRef(null);
  const bannerRef = useRef(null);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const handleSidebarAction = (action) => {
    switch (action) {
      case 'dashboard':
        // Already on dashboard
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'addresses':
        navigate('/profile/addresses');
        break;
      default:
        break;
    }
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
    if (!isLoading && user) {
      const contexts = animateDashboardPage({
        sidebarRef,
        contentRef,
        welcomeRef,
        statsRef,
        recentOrderRef,
        wishlistRef,
        quickActionsRef,
        bannerRef,
      });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading, user]);

  // Get user first name
  const firstName = user?.name?.split(' ')[0] || 'Welcome';

  // Get latest order
  const latestOrder = orders && orders.length > 0 
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null;

  // Get first 3 wishlist items
  const wishlistPreview = wishlist?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <AccountLayout activeTab="dashboard">
        <DashboardSkeleton />
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="dashboard">
      <div ref={contentRef} className="dashboard-content">
        <div ref={welcomeRef}>
          <WelcomeCard firstName={firstName} />
        </div>

        <div ref={statsRef}>
          <StatisticsCards
            ordersCount={orders?.length || 0}
            wishlistCount={wishlist?.length || 0}
            addressesCount={addresses?.length || 0}
            cartCount={cart?.length || 0}
          />
        </div>

        <div ref={recentOrderRef}>
          {latestOrder ? (
            <RecentOrder order={latestOrder} />
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No Recent Orders"
              description="Your recent boutique purchases will appear here."
              buttonText="Shop Now"
              buttonRoute="/shop"
            />
          )}
        </div>

        <div ref={wishlistRef}>
          <WishlistPreview items={wishlistPreview} />
        </div>

        <div ref={quickActionsRef}>
          <QuickActions />
        </div>

        <div ref={bannerRef}>
          <CollectionBanner />
        </div>
      </div>
    </AccountLayout>
  );
};

// GSAP Animations
function animateDashboardPage(refs) {
  const contexts = [];

  if (typeof window !== 'undefined' && window.gsap) {
    const gsap = window.gsap;

    // Sidebar fade in
    if (refs.sidebarRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.sidebarRef.current, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }, refs.sidebarRef);
      contexts.push(ctx);
    }

    // Content fade in
    if (refs.contentRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.contentRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out"
        });
      }, refs.contentRef);
      contexts.push(ctx);
    }

    // Welcome card
    if (refs.welcomeRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.welcomeRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out"
        });
      }, refs.welcomeRef);
      contexts.push(ctx);
    }

    // Statistics cards stagger
    if (refs.statsRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.statsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out"
        });
      }, refs.statsRef);
      contexts.push(ctx);
    }

    // Recent order reveal
    if (refs.recentOrderRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.recentOrderRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.6,
          ease: "power2.out"
        });
      }, refs.recentOrderRef);
      contexts.push(ctx);
    }

    // Wishlist preview stagger
    if (refs.wishlistRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.wishlistRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.7,
          ease: "power2.out"
        });
      }, refs.wishlistRef);
      contexts.push(ctx);
    }

    // Quick actions fade
    if (refs.quickActionsRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.quickActionsRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.8,
          ease: "power2.out"
        });
      }, refs.quickActionsRef);
      contexts.push(ctx);
    }

    // Collection banner reveal
    if (refs.bannerRef?.current) {
      const ctx = gsap.context(() => {
        gsap.from(refs.bannerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.9,
          ease: "power2.out"
        });
      }, refs.bannerRef);
      contexts.push(ctx);
    }
  }

  return contexts;
}

function cleanupAnimations(contexts) {
  if (!contexts) return;
  const list = Array.isArray(contexts) ? contexts : [contexts];
  list.forEach(ctx => {
    if (ctx && typeof ctx.revert === 'function') {
      ctx.revert();
    }
  });
}

export default Dashboard;
