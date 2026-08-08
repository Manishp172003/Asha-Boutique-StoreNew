import "./OrderSuccess.css";
import { useEffect } from "react";
import { useApp } from "../../context/AppContext";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import SuccessHero from "./components/SuccessHero/SuccessHero";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import ActionButtons from "./components/ActionButtons/ActionButtons";

const OrderSuccess = () => {
  const { currentOrder, user, cart, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="order-success-page">

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

      <SuccessHero orderNumber={currentOrder?.orderNumber || currentOrder?.id} />

      <OrderDetails order={currentOrder} />

      <ActionButtons />

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

export default OrderSuccess;
