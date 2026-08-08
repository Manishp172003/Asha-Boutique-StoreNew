import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import DashboardSidebar from "../../pages/Dashboard/components/DashboardSidebar/DashboardSidebar";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import "./AccountLayout.css";

const AccountLayout = ({ children, activeTab }) => {
  const { user, cart, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();
  const navigate = useNavigate();

  const handleCartOpen = () => setCartOpen(true);
  const handleBookingOpen = () => setBookingOpen(true);
  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="account-layout-wrapper">
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

      <main className="account-layout-main">
        <div className="account-layout-container">
          <div className="account-layout-sidebar">
            <DashboardSidebar activeTab={activeTab} onLogout={handleLogoutClick} />
          </div>

          <div className="account-layout-content">
            {children}
          </div>
        </div>
      </main>

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

export default AccountLayout;
