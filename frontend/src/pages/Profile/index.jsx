import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { animateProfilePage, cleanupAnimations } from "../../animations/gsapAnimations";
import { ProfileSkeleton } from "../../components/Skeleton";

import AccountLayout from "../../components/layout/AccountLayout";
import ActiveOrders from "./components/ActiveOrders/ActiveOrders";
import OrderTimeline from "./components/OrderTimeline/OrderTimeline";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    authLoading,
    cart,
    mobileMenuOpen,
    setCartOpen,
    setBookingOpen,
    setMobileMenuOpen,
    handleLogout,
  } = useApp();

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  // Dummy refs (Profile page doesn't scroll to sections)
  const heroRef = useRef(null);
  const atelierRef = useRef(null);
  const styleEditRef = useRef(null);

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
    if (!isLoading && user) {
      const contexts = animateProfilePage({
        sidebarRef,
        contentRef
      });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading, user]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const handleSidebarAction = (action) => {
    switch (action) {
      case 'profile':
        document.querySelector('.profile-details-card')?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <AccountLayout activeTab="profile">
      <div ref={contentRef} className="profile-content">
        <ActiveOrders />
        <ProfileDetails />
        <OrderTimeline />
      </div>
    </AccountLayout>
  );
};

export default Profile;